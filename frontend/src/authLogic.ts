import { actions, kea, reducers, path, selectors, defaults } from "kea";

import type { authLogicType } from "./authLogicType";
import { loaders } from "kea-loaders";
import { AuthApi } from "./lib/auth.api";
import { UserApi, type User } from "./lib/user.api";
import { subscriptions } from "kea-subscriptions";

export const authLogic = kea<authLogicType>([
  path(["src", "authLogic"]),
  actions({
    loginToStore: (jwtToken: string) => ({ jwtToken }),
    reset: true,
  }),
  defaults({
    userData: null as User | null,
  }),
  reducers({
    jwtToken: [
      null as string | null,
      {
        reset: () => null,
      },
    ],
    userData: [
      null as User | null,
      {
        reset: () => null,
      },
    ],
  }),
  selectors({
    isLoggedIn: [(state) => [state.jwtToken], (jwtToken) => jwtToken !== null],
  }),
  loaders(({ values }) => ({
    jwtToken: {
      loadJwtToken: async (googleCode: string): Promise<string | null> => {
        console.log("Loading jwt token. Google code: ", googleCode);

        const jwtToken = await AuthApi.loginGoogle(googleCode);

        console.log("Jwt token loaded", jwtToken);

        return jwtToken;
      },
    },
    userData: {
      loadUserData: async (): Promise<User> => {
        console.log("Loading user data with jwt token", values.jwtToken);
        const userData = await UserApi.loginGoogle(values.jwtToken!);

        console.log("User data loaded", userData);

        return userData;
      },
    },
  })),
  subscriptions(({ actions }) => ({
    jwtToken: (jwtToken) => {
      if (!jwtToken) {
        return;
      }

      console.log("reacting to subscription to jwt token", jwtToken);
      actions.loadUserData();
    },
  })),
]);
