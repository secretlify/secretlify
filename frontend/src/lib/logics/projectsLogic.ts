import { actions, connect, events, kea, listeners, path, selectors } from "kea";

import type { projectsLogicType } from "./projectsLogicType";
import { ProjectsApi, type Project } from "../api/projects.api";
import { authLogic } from "./authLogic";
import { loaders } from "kea-loaders";

export const projectsLogic = kea<projectsLogicType>([
  path(["src", "lib", "logics", "projectsLogic"]),

  connect({
    values: [authLogic, ["jwtToken"]],
  }),

  actions({
    setActiveProjectId: (projectId: string) => ({ projectId }),
    addProject: (project: { id: string; name: string }) => ({ project }),
    readProjectById: (projectId: string) => ({ projectId }),
    loadProjects: true,
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
        (id: string): { id: string; name: string } | undefined =>
          projects.find((project) => {
            console.log("Projects", projects);
            console.log("project", project);
            return project.id === id;
          }),
    ],
  }),

  listeners(({ values, actions }) => ({
    addProject: async ({ project }): Promise<void> => {
      await ProjectsApi.createProject(values.jwtToken!, {
        encryptedPassphrase: "",
        encryptedSecrets: "",
        name: project.name,
      });

      await actions.loadProjects();
    },
  })),

  events(({ actions }) => ({
    afterMount: async () => {
      await actions.loadProjects();
    },
  })),
]);
