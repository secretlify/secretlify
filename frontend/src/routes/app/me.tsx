import { createFileRoute } from "@tanstack/react-router";
import { MePage } from "@/components/app/me/MePage";

export const Route = createFileRoute("/app/me")({
  component: MeTanstackPage,
});

function MeTanstackPage() {
  return <MePage />;
}
