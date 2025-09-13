import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/me")({
  component: Me,
});

function Me() {
  return <div>Hello "/app/me"!</div>;
}
