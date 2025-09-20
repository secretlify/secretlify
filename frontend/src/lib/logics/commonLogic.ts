import { actions, kea, path, reducers } from "kea";

import type { commonLogicType } from "./commonLogicType";

export const commonLogic = kea<commonLogicType>([
  path(["src", "lib", "logics", "commonLogic"]),

  actions({
    setInviteIdToShowAfterLogin: (inviteIdToShowAfterLogin: string | null) => ({
      inviteIdToShowAfterLogin,
    }),
  }),

  reducers({
    inviteIdToShowAfterLogin: [
      null as string | null,
      {
        persist: true,
      },
      {
        setInviteIdToShowAfterLogin: (_, { inviteIdToShowAfterLogin }) =>
          inviteIdToShowAfterLogin,
      },
    ],
  }),
]);
