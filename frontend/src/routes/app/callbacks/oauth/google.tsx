import { createFileRoute } from "@tanstack/react-router";
import { GooglePage } from "@/components/app/callbacks/oauth/GooglePage";

export const Route = createFileRoute("/app/callbacks/oauth/google")({
  component: GoogleTanstackPage,
});

function GoogleTanstackPage() {
  return <GooglePage />;
}
