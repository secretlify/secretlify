import { createFileRoute } from "@tanstack/react-router";
import { ProjectIdPage } from "@/components/app/project/ProjectIdPage";

export const Route = createFileRoute("/app/project/$projectId")({
  component: ProjectIdTanstackPage,
});

function ProjectIdTanstackPage() {
  return <ProjectIdPage />;
}
