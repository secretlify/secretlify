import { CreateFirstProjectView } from "@/components/app/project/CreateFirstProjectView";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/project/")({
  component: ProjectTanstackPage,
});

function ProjectTanstackPage() {
  return <CreateFirstProjectView />;
}
