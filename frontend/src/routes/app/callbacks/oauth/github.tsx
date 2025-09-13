import { authLogic } from "@/authLogic";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useActions, useValues } from "kea";
import { useEffect } from "react";

export const Route = createFileRoute("/app/callbacks/oauth/github")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { exchangeGithubCodeForJwt } = useActions(authLogic);
  const { userData } = useValues(authLogic);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      exchangeGithubCodeForJwt(authCode);
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
