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
    addIntegrationToProject: (githubInstallationId: number) => ({
      githubInstallationId,
    }),
  }),

  listeners(({ values, props, actions }) => ({
    addIntegrationToProject: async ({ githubInstallationId }) => {
      await ProjectsApi.updateProject(values.jwtToken!, {
        projectId: props.projectId,
        githubInstallationId,
      });

      await actions.loadProjectData();
    },
  })),

  selectors({
    githubInstallationId: [
      (s) => [s.projectData],
      (projectData: DecryptedProject) =>
        projectData?.integrations.githubInstallationId,
    ],
  }),
]);
