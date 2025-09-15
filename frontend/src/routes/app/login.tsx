import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/app/login/LoginPage";

export const Route = createFileRoute("/app/login")({
  component: LoginTanstackPage,
});

function LoginTanstackPage() {
  return <LoginPage />;
}
