import { actions, kea, path, reducers } from "kea";

import type { commonLogicType } from "./commonLogicType";

export const commonLogic = kea<commonLogicType>([
  path(["src", "lib", "logics", "commonLogic"]),

  actions({
    setInviteIdToShowAfterLogin: (inviteIdToShowAfterLogin: string | null) => ({
      inviteIdToShowAfterLogin,
    }),
    setShouldReopenIntegrationsDialog: (
      shouldReopenIntegrationsDialog: boolean
    ) => ({
      shouldReopenIntegrationsDialog,
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
    shouldReopenIntegrationsDialog: [
      false,
      {
        persist: true,
      },
      {
        setShouldReopenIntegrationsDialog: (
          _,
          { shouldReopenIntegrationsDialog }
        ) => shouldReopenIntegrationsDialog,
      },
    ],
  }),
]);
