import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/login")({
  component: Login,
});

function Login() {
  return <div>Hello "/app/login"!</div>;
}
