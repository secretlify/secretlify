import { authLogic } from "@/lib/logics/authLogic";
import { useNavigate } from "@tanstack/react-router";
import { useActions, useValues } from "kea";
import { useEffect } from "react";

export function GooglePage() {
  const navigate = useNavigate();

  const { exchangeGoogleCodeForJwt } = useActions(authLogic);
  const { userData } = useValues(authLogic);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      exchangeGoogleCodeForJwt(authCode);
    }
  }, []);

  useEffect(() => {
    if (userData?.email) {
      navigate({ to: "/app/me" });
    }
  }, [userData]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <span className="text-xl font-semibold text-center">
        you will be redirected shortly...
      </span>
    </div>
  );
}
