import { createFileRoute } from "@tanstack/react-router";
import { IndexPage } from "@/components/index/IndexPage";

export const Route = createFileRoute("/")({
  component: IndexTanstackPage,
});

function IndexTanstackPage() {
  return <IndexPage />;
}
