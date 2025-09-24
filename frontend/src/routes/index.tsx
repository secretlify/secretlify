import { createFileRoute } from "@tanstack/react-router";
import { IndexPage } from "@/components/index/IndexPage";
import "@fontsource-variable/merriweather";

export const Route = createFileRoute("/")({
  component: IndexTanstackPage,
});

function IndexTanstackPage() {
  return <IndexPage />;
}
