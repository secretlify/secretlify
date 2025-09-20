import { actions, connect, events, kea, listeners, path, selectors } from "kea";

import type { projectsLogicType } from "./projectsLogicType";
import { ProjectsApi, type Project } from "../api/projects.api";
import { authLogic } from "./authLogic";
import { loaders } from "kea-loaders";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import { subscriptions } from "kea-subscriptions";

export const projectsLogic = kea<projectsLogicType>([
  path(["src", "lib", "logics", "projectsLogic"]),

  connect({
    values: [authLogic, ["jwtToken", "userData"]],
  }),

  actions({
    addProject: (project: { name: string }) => ({ project }),
    readProjectById: (projectId: string) => ({ projectId }),
    loadProjects: true,
    deleteProject: (projectId: string) => ({ projectId }),
  }),

  loaders(({ values }) => ({
    projects: [
      [] as Project[],
      {
        loadProjects: async () => {
          const projects = await ProjectsApi.getProjects(values.jwtToken!);
          return projects;
        },
      },
    ],
  })),

  selectors({
    readProjectById: [
      (state) => [state.projects],
      (projects) =>
        (id: string): Project | undefined =>
          projects.find((project) => {
            return project.id === id;
          }),
    ],
  }),

  listeners(({ values, actions }) => ({
    addProject: async ({ project }): Promise<void> => {
      const projectKey = await SymmetricCrypto.generateProjectKey();

      const content = `BEN="dover"`;
      const contentEncrypted = await SymmetricCrypto.encrypt(
        content,
        projectKey
      );

      const projectKeyEncrypted = await AsymmetricCrypto.encrypt(
        projectKey,
        values.userData!.publicKey!
      );

      await ProjectsApi.createProject(values.jwtToken!, {
        encryptedKeyVersions: {
          [values.userData!.id]: projectKeyEncrypted,
        },
        encryptedSecrets: contentEncrypted,
        name: project.name,
      });

      await actions.loadProjects();
    },
    deleteProject: async ({ projectId }): Promise<void> => {
      await ProjectsApi.deleteProject(values.jwtToken!, projectId);
      await actions.loadProjects();
    },
  })),

  subscriptions(({ actions }) => ({
    jwtToken: () => {
      actions.loadProjects();
    },
    userData: () => {
      actions.loadProjects();
    },
  })),

  events(({ actions }) => ({
    afterMount: async () => {
      await actions.loadProjects();
    },
  })),
]);
