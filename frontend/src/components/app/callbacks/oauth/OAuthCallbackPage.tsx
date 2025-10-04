import { useAfterLogin } from "@/lib/hooks/useAfterLogin";
import { authLogic } from "@/lib/logics/authLogic";
import { useValues } from "kea";
import { useEffect } from "react";

interface OAuthCallbackPageProps {
  exchangeCodeForJwt: (code: string) => void;
}

export function OAuthCallbackPage({
  exchangeCodeForJwt,
}: OAuthCallbackPageProps) {
  const { userData } = useValues(authLogic);
  const { afterLogin } = useAfterLogin();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      exchangeCodeForJwt(authCode);
    }
  }, [exchangeCodeForJwt]);

  useEffect(() => {
    afterLogin(userData);
  }, [userData, afterLogin]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="text-lg text-muted-foreground">
          Fetching projects...
        </span>
      </div>
    </div>
  );
}
