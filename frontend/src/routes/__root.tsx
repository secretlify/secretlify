import { AppNavigation } from "@/components/ui/app-navigation";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const RootLayout = () => (
  <>
    <>
      <AppNavigation />
    </>
    <Outlet />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
