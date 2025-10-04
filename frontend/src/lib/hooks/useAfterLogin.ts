import { useNavigate } from "@tanstack/react-router";
import { useActions, useValues } from "kea";
import type { User } from "../api/user.api";
import { commonLogic } from "../logics/commonLogic";

export function useAfterLogin() {
  const navigate = useNavigate();
  const { inviteIdToShowAfterLogin } = useValues(commonLogic);
  const { setInviteIdToShowAfterLogin } = useActions(commonLogic);

  const afterLogin = (userData: User | null) => {
    if (!userData || !userData.email) {
      return;
    }

    if (inviteIdToShowAfterLogin) {
      navigate({ to: `/invite/${inviteIdToShowAfterLogin}` });
      setInviteIdToShowAfterLogin(null);
    } else {
      navigate({ to: "/app/project" });
    }
  };

  return { afterLogin };
}
