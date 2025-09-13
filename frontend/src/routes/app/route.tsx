import { AppNavigation } from "@/components/ui/app-navigation";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <>
      <AppNavigation />
      <Outlet />
    </>
  );
}
