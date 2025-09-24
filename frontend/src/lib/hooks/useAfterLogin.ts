import { useValues, useActions } from "kea";
import { useNavigate } from "@tanstack/react-router";
import { commonLogic } from "../logics/commonLogic";
import type { User } from "../api/user.api";

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
      navigate({
        to: "/app/project/$projectId",
        params: { projectId: "demo" },
      });
    }
  };

  return { afterLogin };
}
