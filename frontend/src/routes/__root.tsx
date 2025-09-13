import { AppNavigation } from "@/components/ui/app-navigation";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const RootLayout = () => (
  <>
    <Outlet />
    <AppNavigation />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
