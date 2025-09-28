import { IntegrationsApi } from "@/lib/api/integrations.api";
import { authLogic } from "@/lib/logics/authLogic";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useValues } from "kea";
import { useEffect } from "react";

export const Route = createFileRoute("/app/callbacks/integrations/github")({
  component: RouteComponent,
});

function RouteComponent() {
  const { jwtToken } = useValues(authLogic);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("installation_id");
    const state = urlParams.get("state");

    if (!id) {
      return;
    }

    if (!state) {
      return;
    }

    const decodedState = decodeURIComponent(state);

    const cleanState = decodedState.replace(/^"/, "").replace(/"$/, "");
    const projectIdMatch = cleanState.match(/projectId=(.+)/);

    if (!projectIdMatch) {
      return;
    }

    const extractedProjectId = projectIdMatch[1];

    updateProjectAndRedirect(extractedProjectId, id);
  }, []);

  const updateProjectAndRedirect = async (
    projectId: string,
    installationId: string
  ) => {
    await IntegrationsApi.createInstallation(jwtToken!, {
      githubInstallationId: parseInt(installationId!),
    });

    navigate({
      to: "/app/project/$projectId",
      params: { projectId: projectId! },
    });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <span className="text-xl font-semibold text-center">
        Processing GitHub integration...
      </span>
    </div>
  );
}
