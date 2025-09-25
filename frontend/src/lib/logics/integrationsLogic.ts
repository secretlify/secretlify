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
import {
  IntegrationsApi,
  type Installation,
  type Integration,
  type Repository,
} from "../api/integrations.api";
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
    removeInstallationFromProject: true,
    loadRepositories: true,
    loadIntegrations: true,
    createIntegration: (repositoryId: number) => ({ repositoryId }),
  }),

  listeners(({ values, actions, props }) => ({
    removeInstallationFromProject: async () => {
      await ProjectsApi.updateProject(values.jwtToken!, {
        projectId: props.projectId,
        githubInstallationId: null,
      });

      await actions.loadProjectData();
    },
  })),

  loaders(({ values, props, selectors }) => ({
    repositories: [
      [] as Repository[],
      {
        loadRepositories: async () => {
          const repositories = await IntegrationsApi.getRepositories(
            values.jwtToken!,
            values.projectData?.integrations.githubInstallationId!
          );

          return repositories;
        },
      },
    ],
    integrations: [
      [] as Integration[],
      {
        loadIntegrations: async () => {
          const integrations = await IntegrationsApi.getIntegrationsForProject(
            values.jwtToken!,
            props.projectId
          );

          return integrations;
        },
      },
    ],
    installation: [
      null as Installation | null,
      {
        loadInstallation: async () => {
          const installation = await IntegrationsApi.getInstallation(
            values.jwtToken!,
            values.projectData?.integrations?.githubInstallationId!
          );
          return installation;
        },
      },
    ],
  })),

  listeners(({ actions, values, props }) => ({
    createIntegration: async ({ repositoryId }) => {
      await IntegrationsApi.createIntegration(values.jwtToken!, {
        projectId: props.projectId,
        repositoryId,
        installationId: values.projectData?.integrations?.githubInstallationId!,
      });

      actions.loadIntegrations();
    },
  })),

  selectors({
    githubInstallationId: [
      (s) => [s.projectData],
      (projectData: DecryptedProject) =>
        projectData?.integrations?.githubInstallationId,
    ],
  }),

  subscriptions(({ actions }) => ({
    githubInstallationId: (githubInstallationId) => {
      if (!githubInstallationId) {
        return;
      }

      actions.loadRepositories();
      actions.loadIntegrations();
      actions.loadInstallation();
    },
  })),
]);
