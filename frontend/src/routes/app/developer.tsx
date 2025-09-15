import { createFileRoute } from "@tanstack/react-router";
import { DeveloperPage } from "@/components/app/developer/DeveloperPage";

export const Route = createFileRoute("/app/developer")({
  component: DeveloperTanstackPage,
});

function DeveloperTanstackPage() {
  return <DeveloperPage />;
}
