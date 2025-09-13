import { authLogic } from "@/authLogic";
import { createFileRoute } from "@tanstack/react-router";
import { useActions, useValues } from "kea";
import { useEffect } from "react";

export const Route = createFileRoute("/app/me")({
  component: Me,
});

function Me() {
  const { userData } = useValues(authLogic);
  const { loadUserData } = useActions(authLogic);

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <div>
      <h1>Me</h1>
      <p>Email: {userData?.email}</p>
      <p>Auth method: {userData?.authMethod}</p>
    </div>
  );
}
