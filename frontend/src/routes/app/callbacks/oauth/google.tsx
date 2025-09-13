import { authLogic } from "@/authLogic";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useActions } from "kea";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/callbacks/oauth/google")({
  component: RouteComponent,
});

function RouteComponent() {
  const [code, setCode] = useState<string | null>(null);
  const navigate = useNavigate();

  const { loadJwtToken } = useActions(authLogic);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      setCode(authCode);
      loadJwtToken(authCode);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Google OAuth Callback</h1>

      {code && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <div>
            <strong>Authorization Code:</strong>
          </div>
          <div className="break-all font-mono text-sm mt-2">{code}</div>
        </div>
      )}
    </div>
  );
}
