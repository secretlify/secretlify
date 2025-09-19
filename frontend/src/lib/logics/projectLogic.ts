import {
  actions,
  connect,
  kea,
  key,
  listeners,
  path,
  props,
  reducers,
} from "kea";

import type { projectLogicType } from "./projectLogicType";
import { loaders } from "kea-loaders";
import { keyLogic } from "./keyLogic";
import { authLogic } from "./authLogic";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import { ProjectsApi } from "../api/projects.api";
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
    updateProjectContent: (content: string) => ({ content }),
    toggleHistoryView: true,
    setPatches: (patches: string[]) => ({ patches }),
    computePatches: (versions: string[]) => ({ versions }),
  }),

  reducers({
    isShowingHistory: [
      false,
      {
        toggleHistoryView: (state) => !state,
      },
    ],
    patches: [
      [] as string[],
      {
        setPatches: (state, { patches }) => patches,
      },
    ],
  }),

  loaders(({ values, props }) => ({
    projectData: [
      null as DecryptedProject | null,
      {
        loadProjectData: async () => {
          const projectData = await ProjectsApi.getProject(
            values.jwtToken!,
            props.projectId
          );

          const passphraseAsKey = await AsymmetricCrypto.decrypt(
            projectData?.encryptedKeyVersions![values.userData!.id]!,
            values.privateKeyDecrypted!
          );

          const contentDecrypted = await SymmetricCrypto.decrypt(
            projectData?.encryptedSecrets!,
            passphraseAsKey
          );

          return {
            id: projectData?.id!,
            name: projectData?.name!,
            content: contentDecrypted,
            passphraseAsKey: passphraseAsKey,
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
              projectWithVersions.encryptedKeyVersions[values.userData!.id]!,
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

  listeners(({ values, actions, props }) => ({
    updateProjectContent: async ({ content }) => {
      const encryptedContent = await SymmetricCrypto.encrypt(
        content,
        values.projectData?.passphraseAsKey!
      );

      await ProjectsApi.updateProjectContent(values.jwtToken!, {
        projectId: props.projectId,
        encryptedSecrets: encryptedContent,
      });

      await actions.loadProjectData();
    },
    computePatches: ({ versions }) => {
      if (versions.length < 2) {
        actions.setPatches([]);
        return;
      }

      // Reverse the array to get chronological order (oldest to newest)
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

      actions.setPatches(patches);
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
