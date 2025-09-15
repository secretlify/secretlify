import { createFileRoute } from "@tanstack/react-router";
import { ProjectPage } from "@/components/app/project/ProjectPage";

export const Route = createFileRoute("/app/project/$projectId")({
  component: ProjectTanstackPage,
});

function ProjectTanstackPage() {
  return <ProjectPage />;
}
