import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/me")({
  component: Me,
});

function Me() {
  const isLoggedIn = true;

  return <div>Are you logged in? {isLoggedIn ? "Yes" : "No"}</div>;
}
