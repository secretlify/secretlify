import { actions, kea, reducers, path, selectors, defaults } from "kea";

import type { authLogicType } from "./authLogicType";
import { loaders } from "kea-loaders";
import { AuthApi } from "./lib/auth.api";
import { UserApi, type User } from "./lib/user.api";
import { subscriptions } from "kea-subscriptions";

export const authLogic = kea<authLogicType>([
  path(["src", "authLogic"]),

  actions({
    setJwtToken: (jwtToken: string) => ({ jwtToken }),
    setUserData: (userData: User) => ({ userData }),

    reset: true,
  }),

  defaults({
    userData: null as User | null,
  }),

  reducers({
    jwtToken: [
      null as string | null,
      {
        persist: true,
      },
      {
        setJwtToken: (_, { jwtToken }) => jwtToken,
        reset: () => null,
      },
    ],
    userData: [
      null as User | null,
      {
        setUserData: (_, { userData }) => userData,
        reset: () => null,
      },
    ],
  }),

  selectors({
    isLoggedIn: [(state) => [state.jwtToken], (jwtToken) => jwtToken !== null],
  }),

  loaders(({ values }) => ({
    jwtToken: {
      exchangeGoogleCodeForJwt: async (
        googleCode: string
      ): Promise<string | null> => {
        const jwtTokenValue = await AuthApi.loginGoogle(googleCode);

        return jwtTokenValue;
      },
      exchangeGithubCodeForJwt: async (
        githubCode: string
      ): Promise<string | null> => {
        console.log("exchangeGithubCodeForJwt", githubCode);

        const jwtTokenValue = await AuthApi.loginGithub(githubCode);

        console.log("jwtTokenValue", jwtTokenValue);

        return jwtTokenValue;
      },
    },
    userData: {
      loadUserData: async (): Promise<User> => {
        console.log("before user data");
        const userDataValue = await UserApi.loginGoogle(values.jwtToken!);

        console.log("after user data", userDataValue);

        return userDataValue;
      },
    },
  })),

  subscriptions(({ actions }) => ({
    jwtToken: (jwtToken) => {
      if (!jwtToken) {
        return;
      }

      actions.loadUserData();
    },
  })),
]);
