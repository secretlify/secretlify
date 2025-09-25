import {
  actions,
  connect,
  kea,
  key,
  listeners,
  path,
  props,
  selectors,
} from "kea";

import type { integrationsLogicType } from "./integrationsLogicType";
import { authLogic } from "./authLogic";
import { ProjectsApi } from "../api/projects.api";
import { projectLogic, type DecryptedProject } from "./projectLogic";
import { loaders } from "kea-loaders";
import { IntegrationsApi, type Repository } from "../api/integrations.api";
import { subscriptions } from "kea-subscriptions";

export interface IntegrationsLogicProps {
  projectId: string;
}

export const integrationsLogic = kea<integrationsLogicType>([
  path(["src", "lib", "logics", "integrationsLogic"]),

  props({} as IntegrationsLogicProps),

  key((props) => props.projectId),

  connect({
    values: [authLogic, ["jwtToken"], projectLogic, ["projectData"]],
    actions: [projectLogic, ["loadProjectData"]],
  }),

  actions({
    removeIntegrationFromProject: true,
    loadRepositories: true,
  }),

  listeners(({ values, actions, props }) => ({
    removeIntegrationFromProject: async () => {
      await ProjectsApi.updateProject(values.jwtToken!, {
        projectId: props.projectId,
        githubInstallationId: null,
      });

      await actions.loadProjectData();
    },
  })),

  loaders(({ values }) => ({
    repositories: [
      [] as Repository[],
      {
        loadRepositories: async () => {
          const repositories = await IntegrationsApi.getRepositories(
            values.jwtToken!,
            values.projectData?.integrations.githubInstallationId!,
            ""
          );

          return repositories;
        },
      },
    ],
  })),

  selectors({
    githubInstallationId: [
      (s) => [s.projectData],
      (projectData: DecryptedProject) =>
        projectData?.integrations.githubInstallationId,
    ],
  }),

  subscriptions(({ actions }) => ({
    githubInstallationId: (githubInstallationId) => {
      if (!githubInstallationId) {
        return;
      }

      actions.loadRepositories();
    },
  })),
]);
