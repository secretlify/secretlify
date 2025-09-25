import { ProjectsApi } from "@/lib/api/projects.api";
import { authLogic } from "@/lib/logics/authLogic";
import { createFileRoute } from "@tanstack/react-router";
import { useValues } from "kea";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/callbacks/integrations/github")({
  component: RouteComponent,
});

function RouteComponent() {
  const [installationId, setInstallationId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { jwtToken } = useValues(authLogic);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("installation_id");
    const state = urlParams.get("state");

    if (!id) {
      setError("Missing installation_id parameter");
      return;
    }

    if (!state) {
      setError("Missing state parameter");
      return;
    }

    try {
      // Decode the URL-encoded state parameter
      const decodedState = decodeURIComponent(state);

      // Remove surrounding quotes if present and extract project ID
      const cleanState = decodedState.replace(/^"/, "").replace(/"$/, "");
      const projectIdMatch = cleanState.match(/projectId=(.+)/);

      if (!projectIdMatch) {
        setError("Invalid state format - projectId not found");
        return;
      }

      const extractedProjectId = projectIdMatch[1];

      setInstallationId(id);
      setProjectId(extractedProjectId);

      void ProjectsApi.updateProject(jwtToken!, {
        projectId: extractedProjectId,
        githubInstallationId: parseInt(id),
      });
    } catch (err) {
      setError("Failed to parse state parameter");
      console.error("Error parsing state:", err);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <span className="text-xl font-semibold text-center">
        {error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : installationId && projectId ? (
          <>
            GitHub Integration Complete
            <br />
            <small className="text-sm opacity-70">
              Project: {projectId} | Installation: {installationId}
            </small>
          </>
        ) : (
          "Processing GitHub integration..."
        )}
      </span>
    </div>
  );
}
