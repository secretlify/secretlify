import { actions, kea, listeners, path, reducers, selectors } from "kea";

import type { projectsLogicType } from "./projectsLogicType";
import { randomId } from "../utils";

const defaultId = randomId();

export const projectsLogic = kea<projectsLogicType>([
  path(["src", "lib", "logics", "projectsLogic"]),

  actions({
    setActiveProjectId: (projectId: string) => ({ projectId }),
    addProject: (project: { id: string; name: string }) => ({ project }),
    readProjectById: (projectId: string) => ({ projectId }),
  }),

  reducers(() => ({
    projects: [
      [
        {
          id: defaultId,
          name: "Logdash",
        },
        {
          id: randomId(),
          name: "BlueMenu",
        },
        {
          id: randomId(),
          name: "KiedyKolos",
        },
      ] as { id: string; name: string }[],
      {
        addProject: (projects, { project }) => [...projects, project],
      },
    ],
  })),

  selectors({
    readProjectById: [
      (state) => [state.projects],
      (projects) =>
        (id: string): { id: string; name: string } | undefined =>
          projects.find((project) => project.id === id),
    ],
  }),
]);
