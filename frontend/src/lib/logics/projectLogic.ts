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

import type { projectTileLogicType } from "./projectLogicType";
import { keyLogic } from "./keyLogic";
import { authLogic } from "./authLogic";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { ProjectsApi, type ProjectMember } from "../api/projects.api";
import { projectsLogic } from "./projectsLogic";
import { SodiumCrypto } from "../crypto/crypto.sodium";
import { IntegrationsApi } from "../api/integrations.api";
import { projectDataLogic } from "./projectDataLogic";
import { subscriptions } from "kea-subscriptions";

export interface ProjectTileLogicProps {
  projectId: string;
}

export const projectTileLogic = kea<projectTileLogicType>([
  path(["src", "lib", "logics", "projectTileLogic"]),

  props({} as ProjectTileLogicProps),

  key((props) => props.projectId),

  connect({
    values: [
      projectDataLogic,
      ["projectData", "projectDataLoading", "patches"],
      keyLogic,
      ["privateKeyDecrypted"],
      authLogic,
      ["userData", "jwtToken"],
      projectsLogic,
      ["projects"],
    ],
    actions: [projectDataLogic, ["loadProjectData"]],
  }),

  actions({
    updateProjectContent: true,
    toggleHistoryView: true,
    setIsShowingHistory: (isShowingHistory: boolean) => ({ isShowingHistory }),
    selectHistoryChange: (changeId: string | null, patch: string | null) => ({
      changeId,
      patch,
    }),
    setInputValue: (content: string) => ({ content }),
    setIsSubmitting: (isSubmitting: boolean) => ({ isSubmitting }),
  }),

  reducers({
    selectedHistoryChangeId: [
      null as string | null,
      {
        selectHistoryChange: (_, { changeId }) => changeId,
        toggleHistoryView: () => null, // Clear selection when toggling
      },
    ],
    inputValue: [
      "" as string,
      {
        setInputValue: (_, { content }) => content,
      },
    ],
    isSubmitting: [
      false as boolean,
      {
        setIsSubmitting: (_, { isSubmitting }) => isSubmitting,
      },
    ],
    isShowingHistory: [
      false as boolean,
      {
        selectHistoryChange: () => true,
        setIsShowingHistory: (_, { isShowingHistory }) => isShowingHistory,
        toggleHistoryView: (state) => !state,
      },
    ],
  }),

  selectors(({ values }) => ({
    isEditorDirty: [
      (s) => [s.inputValue, s.projectData, s.projectDataLoading],
      (inputValue, projectData, projectDataLoading) =>
        inputValue !== projectData?.content && !projectDataLoading,
    ],
    lastEditAuthor: [(s) => [s.patches], (patches) => patches[0]?.author],
    currentUserRole: [
      (s) => [s.projectData],
      (projectData) =>
        projectData?.members?.find(
          (member: ProjectMember) => member.id === values.userData?.id
        )?.role,
    ],
  })),

  listeners(({ values, actions, props, asyncActions }) => ({
    updateProjectContent: async () => {
      actions.setIsSubmitting(true);

      const encryptedContent = await SymmetricCrypto.encrypt(
        values.inputValue,
        values.projectData?.passphraseAsKey!
      );

      await ProjectsApi.updateProjectContent(values.jwtToken!, {
        projectId: props.projectId,
        encryptedSecrets: encryptedContent,
      });

      const publicKey = "MnHZLJHhP7HtOWl875N97yFFi8W2Fui9hrzw2XelzCk=";

      const [secretName, secretValue] = values.inputValue.split("=");

      const encrypted = await SodiumCrypto.encrypt(secretValue, publicKey);

      const githubToken = await IntegrationsApi.getAccessToken(
        values.jwtToken!,
        {
          installationId: 87513586,
        }
      );

      console.log("Token", githubToken);

      console.log("EncryptedValue", encrypted);

      await IntegrationsApi.pushSecret(githubToken, {
        owner: "arturwita",
        repo: "jamaica",
        encryptedValue: encrypted,
        keyId: "3380204578043523366",
        secretName,
      });

      await asyncActions.loadProjectData();
      actions.setIsSubmitting(false);
    },
  })),

  subscriptions(({ actions }) => ({
    projectData: (newProjectData) => {
      console.log("newProjectData", newProjectData);
      actions.setInputValue(newProjectData?.content!);
    },
  })),
]);
