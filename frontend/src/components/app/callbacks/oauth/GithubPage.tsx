import { useAfterLogin } from "@/lib/hooks/useAfterLogin";
import { authLogic } from "@/lib/logics/authLogic";
import { useActions, useValues } from "kea";
import { useEffect } from "react";

export function GithubPage() {
  const { exchangeGithubCodeForJwt } = useActions(authLogic);
  const { userData } = useValues(authLogic);
  const { afterLogin } = useAfterLogin();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      exchangeGithubCodeForJwt(authCode);
    }
  }, []);

  useEffect(() => {
    afterLogin(userData);
  }, [userData]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <span className="text-xl font-semibold text-center">
        you will be redirected shortly...
      </span>
    </div>
  );
}
