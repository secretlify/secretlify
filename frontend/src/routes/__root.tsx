import { authLogic } from "@/lib/logics/authLogic";
import { AppNavigation } from "@/components/navigation/app-navigation";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { BindLogic } from "kea";

const RootLayout = () => (
  <BindLogic logic={authLogic} props={{}}>
    <Outlet />
    <AppNavigation />
  </BindLogic>
);

export const Route = createRootRoute({ component: RootLayout });
