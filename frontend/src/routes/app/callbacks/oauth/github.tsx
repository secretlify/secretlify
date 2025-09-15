import { createFileRoute } from "@tanstack/react-router";
import { GithubPage } from "@/components/app/callbacks/oauth/GithubPage";

export const Route = createFileRoute("/app/callbacks/oauth/github")({
  component: GithubTanstackPage,
});

function GithubTanstackPage() {
  return <GithubPage />;
}
