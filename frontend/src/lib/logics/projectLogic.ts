import { actions, connect, events, kea, key, path, props, reducers } from "kea";

import type { projectLogicType } from "./projectLogicType";
import { loaders } from "kea-loaders";
import { keyLogic } from "./keyLogic";
import { authLogic } from "./authLogic";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";

interface ProjectLogicProps {
  projectId: string;
}

interface ProjectData {
  projectKeyEncrypted: string;
}

function generate32CharactersRandomString(): string {
  return Math.random().toString(36).slice(2, 15);
}

export const projectLogic = kea<projectLogicType>([
  path(["src", "lib", "logics", "projectLogic"]),

  props({} as ProjectLogicProps),

  connect({
    values: [keyLogic, ["privateKeyDecrypted"], authLogic, ["userData"]],
  }),

  key((props) => props.projectId),

  actions({
    setProjectData: (projectData: ProjectData) => ({ projectData }),
  }),

  reducers({
    projectData: [
      {} as ProjectData,
      {
        setProjectData: (_, { projectData }) => projectData,
      },
    ],
  }),

  loaders({}),

  events(({ actions, values }) => ({
    afterMount: async () => {
      console.log("Mounted");

      const projectKey = generate32CharactersRandomString();

      console.log("projectKey", projectKey);

      const projectKeyEncrypted = SymmetricCrypto.encrypt(
        projectKey,
        await SymmetricCrypto.deriveBase64KeyFromPassphrase(
          values.privateKeyDecrypted!
        )
      );

      console.log("projectKeyEncrypted", projectKeyEncrypted);

      actions.setProjectData({
        projectKeyEncrypted,
      });
    },
  })),
]);
