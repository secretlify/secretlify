import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/callbacks/integrations/github")({
  component: RouteComponent,
});

function RouteComponent() {
  const [installationId, setInstallationId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("installation_id");

    if (id) {
      setInstallationId(id);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <span className="text-xl font-semibold text-center">
        {installationId ? (
          <>GitHub Integration - Installation ID: {installationId}</>
        ) : (
          "Loading GitHub integration..."
        )}
      </span>
    </div>
  );
}
