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

import type { integrationsLogicType } from "./integrationsLogicType";
import { authLogic } from "./authLogic";
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
    actions: [projectLogic, ["loadProjectData", "setIntegrations"]],
  }),

  actions({
    removeInstallationFromProject: true,
    loadRepositories: true,
    loadIntegrations: true,
    createIntegration: (repositoryId: number) => ({ repositoryId }),
    removeIntegration: (integrationId: string) => ({ integrationId }),
    setRepositories: (repositories: Repository[]) => ({ repositories }),
    setIntegrations: (integrations: Integration[]) => ({ integrations }),
    setInstallation: (installation: Installation | null) => ({ installation }),
  }),

  reducers({
    repositories: [
      [] as Repository[],
      {
        setRepositories: (_, { repositories }) => repositories,
      },
    ],
    integrations: [
      [] as Integration[],
      {
        setIntegrations: (_, { integrations }) => integrations,
      },
    ],
    installation: [
      null as Installation | null,
      {
        setInstallation: (_, { installation }) => installation,
      },
    ],
  }),

  loaders(({ values, props }) => ({
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

          // never do this. This is so wrong
          projectLogic({
            projectId: props.projectId,
          }).actions.setIntegrations(integrations);

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
    removeIntegration: async ({ integrationId }) => {
      await IntegrationsApi.deleteIntegration(values.jwtToken!, integrationId);
      actions.loadIntegrations();
    },
    removeInstallationFromProject: async () => {
      await IntegrationsApi.deleteInstallationFromProject(
        values.jwtToken!,
        props.projectId
      );
      actions.loadProjectData();
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
        actions.setRepositories([]);
        actions.setIntegrations([]);
        actions.setInstallation(null);

        return;
      }

      actions.loadRepositories();
      actions.loadIntegrations();
      actions.loadInstallation();
    },
  })),
]);
