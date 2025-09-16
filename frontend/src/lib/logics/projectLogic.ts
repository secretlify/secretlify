import { actions, connect, kea, key, listeners, path, props } from "kea";

import type { projectLogicType } from "./projectLogicType";
import { loaders } from "kea-loaders";
import { keyLogic } from "./keyLogic";
import { authLogic } from "./authLogic";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import { ProjectsApi } from "../api/projects.api";
import { subscriptions } from "kea-subscriptions";
import { projectsLogic } from "./projectsLogic";

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
  }),

  loaders(({ values, props }) => ({
    projectData: [
      null as DecryptedProject | null,
      {
        loadProjectData: async () => {
          console.log("loadProjectData", values.jwtToken, props.projectId);

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
  })),

  subscriptions(({ actions }) => ({
    projects: () => {
      actions.loadProjectData();
    },
  })),
]);
