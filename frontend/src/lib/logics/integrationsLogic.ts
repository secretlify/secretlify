import {
  actions,
  connect,
  events,
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
    loadInstallations: true,
    createIntegration: (repositoryId: number, installationId: number) => ({
      repositoryId,
      installationId,
    }),
    removeIntegration: (integrationId: string) => ({ integrationId }),
    setRepositories: (repositories: Repository[]) => ({ repositories }),
    setLocalIntegrations: (integrations: Integration[]) => ({ integrations }),
    setInstallations: (installations: Installation[]) => ({ installations }),
    setSelectedInstallationEntityId: (installationEntityId: string) => ({
      installationEntityId,
    }),
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
        setLocalIntegrations: (_, { integrations }) => integrations,
      },
    ],
    installation: [
      null as Installation | null,
      {
        setInstallation: (_, { installation }) => installation,
      },
    ],
    installations: [
      [] as Installation[],
      {
        setInstallations: (_, { installations }) => installations,
      },
    ],
    selectedInstallationEntityId: [
      null as string | null,
      {
        setSelectedInstallationEntityId: (_, { installationEntityId }) =>
          installationEntityId,
      },
    ],
  }),

  loaders(({ values, props }) => ({
    repositories: [
      [] as Repository[],
      {
        loadRepositories: async () => {
          if (!values.selectedInstallationEntityId) {
            return [];
          }

          const repositories = await IntegrationsApi.getRepositories(
            values.jwtToken!,
            values.selectedInstallationEntityId!
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
    installations: [
      [] as Installation[],
      {
        loadInstallations: async () => {
          const installations =
            await IntegrationsApi.getInstallationAvailableForUser(
              values.jwtToken!
            );
          return installations;
        },
      },
    ],
  })),

  listeners(({ actions, values, props }) => ({
    createIntegration: async ({ repositoryId }) => {
      await IntegrationsApi.createIntegration(values.jwtToken!, {
        projectId: props.projectId,
        repositoryId,
        installationEntityId: values.selectedInstallationEntityId!,
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

        return;
      }

      actions.loadIntegrations();
      actions.loadInstallations();
    },
    selectedInstallationEntityId: () => {
      console.log("Id changed to loading repos");
      actions.loadRepositories();
    },
  })),

  events(({ actions }) => ({
    afterMount: () => {
      actions.loadInstallations();
      actions.loadIntegrations();
    },
  })),
]);
