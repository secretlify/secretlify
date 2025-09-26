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

import { loaders } from "kea-loaders";
import { keyLogic } from "./keyLogic";
import { authLogic } from "./authLogic";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import {
  ProjectsApi,
  type DecryptedVersion,
  type Integrations,
  type ProjectMember,
} from "../api/projects.api";
import { subscriptions } from "kea-subscriptions";
import { projectsLogic } from "./projectsLogic";
import { createPatch } from "diff";

import type { projectDataLogicType } from "./projectDataLogicType";

export interface ProjectDataLogicProps {
  projectId: string;
}

export interface DecryptedProject {
  id: string;
  name: string;
  content: string;
  passphraseAsKey: string;
  members: ProjectMember[];
  updatedAt: string;
  integrations: Integrations;
}

export interface Patch {
  id: string;
  author: ProjectMember;
  createdAt: string;
  updatedAt: string;
  content: string;
}

export const projectDataLogic = kea<projectDataLogicType>([
  path(["src", "lib", "logics", "projectDataLogic"]),

  props({} as ProjectDataLogicProps),

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
    setPatches: (patches: Patch[]) => ({ patches }),
    computePatches: (versions: DecryptedVersion[]) => ({ versions }),
  }),

  reducers({
    patches: [
      [] as Patch[],
      {
        setPatches: (_, { patches }) => patches,
      },
    ],
    projectData: [
      null as DecryptedProject | null,
      {
        setProjectData: (_, { projectData }) => projectData,
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

          const projectKeyDecrypted = await AsymmetricCrypto.decrypt(
            projectData?.encryptedSecretsKeys![values.userData!.id]!,
            values.privateKeyDecrypted!
          );
          const contentDecrypted = await SymmetricCrypto.decrypt(
            projectData?.encryptedSecrets!,
            projectKeyDecrypted
          );

          return {
            id: projectData?.id!,
            name: projectData?.name!,
            content: contentDecrypted,
            passphraseAsKey: projectKeyDecrypted,
            members: projectData?.members!,
            updatedAt: projectData?.updatedAt!,
            integrations: projectData?.integrations!,
          };
        },
      },
    ],
    projectVersions: [
      [] as DecryptedVersion[],
      {
        loadProjectVersions: async () => {
          const versions = await ProjectsApi.getProjectVersions(
            values.jwtToken!,
            props.projectId
          );

          const myKey = values.projectData?.passphraseAsKey;

          if (!myKey) {
            return [];
          }

          const decryptedVersions: DecryptedVersion[] = [];

          for (const version of versions) {
            const contentDecrypted = await SymmetricCrypto.decrypt(
              version.encryptedSecrets,
              myKey
            );
            decryptedVersions.push({ ...version, content: contentDecrypted });
          }

          return decryptedVersions;
        },
      },
    ],
  })),

  selectors(({ values }) => ({
    lastEditAuthor: [(s) => [s.patches], (patches) => patches[0]?.author],
    currentUserRole: [
      (s) => [s.projectData],
      (projectData) =>
        projectData?.members?.find(
          (member) => member.id === values.userData?.id
        )?.role,
    ],
  })),

  listeners(({ values, actions, props, asyncActions }) => ({
    computePatches: ({ versions }) => {
      if (versions.length < 2) {
        actions.setPatches([]);
        return;
      }

      const chronologicalVersions = [...versions].reverse();
      const patches: Patch[] = [];

      for (let i = 0; i < chronologicalVersions.length - 1; i++) {
        const oldVersion = chronologicalVersions[i];
        const newVersion = chronologicalVersions[i + 1];

        const patch = createPatch(
          `version_${i + 1}_to_${i + 2}`,
          oldVersion.content,
          newVersion.content
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

        patches.push({
          id: newVersion.id,
          author: newVersion.author,
          createdAt: newVersion.createdAt,
          updatedAt: newVersion.updatedAt,
          content: cleanPatch,
        });
      }

      actions.setPatches(patches.reverse());
    },
  })),

  subscriptions(({ actions }) => ({
    projects: (newProjects) => {
      if (!newProjects || newProjects.length === 0) {
        return;
      }

      actions.loadProjectData();
    },
    projectData: (newProjectData) => {
      if (!newProjectData) {
        return;
      }

      console.log("new project data in tile logic", newProjectData);

      actions.loadProjectVersions();
    },
    projectVersions: (versions) => {
      actions.computePatches(versions);
    },
  })),
]);
