import {
  actions,
  connect,
  kea,
  key,
  listeners,
  path,
  props,
  reducers,
} from "kea";

import type { projectSettingsLogicType } from "./projectSettingsLogicType";
import {
  ProjectsApi,
  type UpdateProjectDto,
  type UpdateMemberRoleDto,
  type RemoveMemberDto,
} from "../api/projects.api";
import { projectsLogic } from "./projectsLogic";
import { projectLogic } from "./projectLogic";
import { authLogic } from "./authLogic";

export interface ProjectSettingsLogicProps {
  projectId: string;
}

export const projectSettingsLogic = kea<projectSettingsLogicType>([
  path(["src", "lib", "logics", "projectSettingsLogic"]),

  props({} as ProjectSettingsLogicProps),

  key((props) => props.projectId),

  connect({
    values: [authLogic, ["jwtToken"]],
    actions: [
      projectsLogic,
      ["loadProjects"],
      projectLogic,
      ["loadProjectData"],
    ],
  }),

  actions({
    updateProject: (dto: UpdateProjectDto) => ({ dto }),
    setUpdateProjectLoading: (updateProjectLoading: boolean) => ({
      updateProjectLoading,
    }),

    updateMemberRole: (dto: UpdateMemberRoleDto) => ({ dto }),
    setUpdateMemberRoleLoading: (updateMemberRoleLoading: boolean) => ({
      updateMemberRoleLoading,
    }),

    removeMember: (dto: RemoveMemberDto) => ({ dto }),

    deleteProject: true,
    setDeleteProjectLoading: (deleteProjectLoading: boolean) => ({
      deleteProjectLoading,
    }),
  }),

  reducers({
    updateProjectLoading: [
      false as boolean,
      {
        updateProject: () => true,
        setUpdateProjectLoading: (_, { updateProjectLoading }) =>
          updateProjectLoading,
      },
    ],
    updateMemberRoleLoading: [
      false as boolean,
      {
        updateMemberRole: () => true,
        setUpdateMemberRoleLoading: (_, { updateMemberRoleLoading }) =>
          updateMemberRoleLoading,
      },
    ],
    deleteProjectLoading: [
      false as boolean,
      {
        deleteProject: () => true,
        setDeleteProjectLoading: (_, { deleteProjectLoading }) =>
          deleteProjectLoading,
      },
    ],
  }),

  listeners(({ props, values, actions }) => ({
    updateProject: async ({ dto }) => {
      await ProjectsApi.updateProject(values.jwtToken!, dto);
      actions.loadProjects();

      actions.setUpdateProjectLoading(false);
    },
    updateMemberRole: async ({ dto }) => {
      await ProjectsApi.updateMemberRole(values.jwtToken!, dto);
      actions.loadProjects();
      actions.loadProjectData();

      actions.setUpdateMemberRoleLoading(false);
    },
    removeMember: async ({ dto }) => {
      await ProjectsApi.removeMember(values.jwtToken!, dto);
      actions.loadProjects();
      actions.loadProjectData();
    },
    deleteProject: async () => {
      await ProjectsApi.deleteProject(values.jwtToken!, props.projectId);
      actions.loadProjects();
    },
  })),
]);
