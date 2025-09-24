import {
  actions,
  defaults,
  kea,
  listeners,
  path,
  reducers,
  selectors,
} from "kea";

import { loaders } from "kea-loaders";
import { subscriptions } from "kea-subscriptions";
import { AuthApi } from "../api/auth.api";
import { UserApi, type User } from "../api/user.api";

import { router } from "kea-router";
import posthog from "posthog-js";
import type { authLogicType } from "./authLogicType";

export const authLogic = kea<authLogicType>([
  path(["src", "lib", "logics", "authLogic"]),

  actions({
    setJwtToken: (jwtToken: string) => ({ jwtToken }),
    setUserData: (userData: User) => ({ userData }),

    reset: true,
    logout: true,
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
        const jwtTokenValue = await AuthApi.loginGithub(githubCode);

        return jwtTokenValue;
      },
    },
    userData: {
      loadUserData: async (): Promise<User> => {
        const userDataValue = await UserApi.getMe(values.jwtToken!);

        if (userDataValue.email) {
          posthog.identify(userDataValue.email);
        }

        return userDataValue;
      },
    },
  })),

  listeners(({ actions }) => ({
    logout: () => {
      actions.reset();
      router.actions.push("/app/login");
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
