import { createFileRoute } from "@tanstack/react-router";
import { ProjectLayout as ProjectLayoutComponent } from "@/components/layouts/ProjectLayout";

export const Route = createFileRoute("/app/project")({
  component: ProjectTanstackLayout,
});

function ProjectTanstackLayout() {
  return <ProjectLayoutComponent />;
}
