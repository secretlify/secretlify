import {
  actions,
  connect,
  kea,
  key,
  listeners,
  path,
  props,
  reducers,
  selectors,
} from "kea";

import type { projectLogicType } from "./projectLogicType";
import { loaders } from "kea-loaders";
import { keyLogic } from "./keyLogic";
import { authLogic } from "./authLogic";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import { ProjectsApi, type ProjectMember } from "../api/projects.api";
import { subscriptions } from "kea-subscriptions";
import { projectsLogic } from "./projectsLogic";
import { createPatch } from "diff";

export interface ProjectLogicProps {
  projectId: string;
}

export interface DecryptedProject {
  id: string;
  name: string;
  content: string;
  passphraseAsKey: string;
  members: ProjectMember[];
  updatedAt: string;
}

export const projectLogic = kea<projectLogicType>([
  path(["src", "lib", "logics", "projectLogic"]),

  props({} as ProjectLogicProps),

  key((props) => props.projectId),

  connect({
    values: [
      keyLogic,
      ["privateKeyDecrypted"],
      authLogic,
      ["userData", "jwtToken"],
      projectsLogic,
      ["projects"],
    ],
  }),

  actions({
    updateProjectContent: true,
    toggleHistoryView: true,
    setIsShowingHistory: (isShowingHistory: boolean) => ({ isShowingHistory }),
    selectHistoryChange: (changeId: string | null, patch: string | null) => ({
      changeId,
      patch,
    }),
    setPatches: (patches: string[]) => ({ patches }),
    computePatches: (versions: string[]) => ({ versions }),
    setInputValue: (content: string) => ({ content }),
    setIsSubmitting: (isSubmitting: boolean) => ({ isSubmitting }),
  }),

  reducers({
    selectedHistoryChangeId: [
      null as string | null,
      {
        selectHistoryChange: (_, { changeId }) => changeId,
        toggleHistoryView: () => null, // Clear selection when toggling
      },
    ],
    patches: [
      [] as string[],
      {
        setPatches: (_, { patches }) => patches,
      },
    ],
    inputValue: [
      "" as string,
      {
        setInputValue: (_, { content }) => content,
      },
    ],
    isSubmitting: [
      false as boolean,
      {
        setIsSubmitting: (_, { isSubmitting }) => isSubmitting,
      },
    ],
    projectData: [
      null as DecryptedProject | null,
      {
        setProjectData: (_, { projectData }) => projectData,
      },
    ],
    isShowingHistory: [
      false as boolean,
      {
        selectHistoryChange: () => true,
        setIsShowingHistory: (_, { isShowingHistory }) => isShowingHistory,
        toggleHistoryView: (state) => !state,
      },
    ],
  }),

  loaders(({ values, props, actions }) => ({
    projectData: [
      null as DecryptedProject | null,
      {
        loadProjectData: async () => {
          const projectData = await ProjectsApi.getProject(
            values.jwtToken!,
            props.projectId
          );

          const projectKeyDecrypted = await AsymmetricCrypto.decrypt(
            projectData?.encryptedSecretsKeys![values.userData!.id]!,
            values.privateKeyDecrypted!
          );

          const contentDecrypted = await SymmetricCrypto.decrypt(
            projectData?.encryptedSecrets!,
            projectKeyDecrypted
          );

          actions.setInputValue(contentDecrypted);

          return {
            id: projectData?.id!,
            name: projectData?.name!,
            content: contentDecrypted,
            passphraseAsKey: projectKeyDecrypted,
            members: projectData?.members!,
            updatedAt: projectData?.updatedAt!,
          };
        },
      },
    ],
    projectVersions: [
      [] as string[],
      {
        loadProjectVersions: async () => {
          const projectWithVersions = await ProjectsApi.getProjectVersions(
            values.jwtToken!,
            props.projectId
          );

          const decryptedSecretsVersions: string[] = [];

          for (const version of projectWithVersions.encryptedSecretsHistory) {
            const passphraseAsKey = await AsymmetricCrypto.decrypt(
              projectWithVersions.encryptedSecretsKeys[values.userData!.id]!,
              values.privateKeyDecrypted!
            );

            const contentDecrypted = await SymmetricCrypto.decrypt(
              version,
              passphraseAsKey
            );

            decryptedSecretsVersions.push(contentDecrypted);
          }

          return decryptedSecretsVersions;
        },
      },
    ],
  })),

  selectors({
    isEditorDirty: [
      (s) => [s.inputValue, s.projectData],
      (inputValue, projectData) => inputValue !== projectData?.content,
    ],
  }),

  listeners(({ values, actions, props, asyncActions }) => ({
    updateProjectContent: async () => {
      actions.setIsSubmitting(true);

      const encryptedContent = await SymmetricCrypto.encrypt(
        values.inputValue,
        values.projectData?.passphraseAsKey!
      );

      await ProjectsApi.updateProjectContent(values.jwtToken!, {
        projectId: props.projectId,
        encryptedSecrets: encryptedContent,
      });

      await Promise.all([
        asyncActions.loadProjectData(),
        asyncActions.loadProjectVersions(),
      ]);

      actions.setIsSubmitting(false);
    },
    computePatches: ({ versions }) => {
      if (versions.length < 2) {
        actions.setPatches([]);
        return;
      }

      const chronologicalVersions = [...versions].reverse();
      const patches: string[] = [];

      for (let i = 0; i < chronologicalVersions.length - 1; i++) {
        const oldVersion = chronologicalVersions[i];
        const newVersion = chronologicalVersions[i + 1];

        const patch = createPatch(
          `version_${i + 1}_to_${i + 2}`,
          oldVersion,
          newVersion
        );

        const cleanPatch = patch
          .split("\n")
          .filter((line) => {
            if (
              line.startsWith("---") ||
              line.startsWith("+++") ||
              line.startsWith("@@") ||
              line.startsWith("Index:") ||
              line.startsWith("\\")
            ) {
              return false;
            }
            return line.match(/^[\+\-\s]/);
          })
          .join("\n");

        patches.push(cleanPatch);
      }

      actions.setPatches(patches.reverse());
    },
  })),

  subscriptions(({ actions }) => ({
    projects: () => {
      actions.loadProjectData();
      actions.loadProjectVersions();
    },
    projectVersions: (versions) => {
      actions.computePatches(versions);
    },
  })),
]);
