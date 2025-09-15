import { authLogic } from "@/lib/logics/authLogic";
import { keyLogic } from "@/lib/logics/keyLogic";
import { AppNavigation } from "@/components/navigation/app-navigation";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { BindLogic } from "kea";
import { SetUpPassphraseDialog } from "@/components/dialogs/SetUpPassphraseDialog";
import { UnlockBrowserDialog } from "@/components/dialogs/UnlockBrowserDialog";
import { projectsLogic } from "@/lib/logics/projectsLogic";

const RootLayout = () => (
  <BindLogic logic={authLogic} props={{}}>
    <BindLogic logic={keyLogic} props={{}}>
      <BindLogic logic={projectsLogic} props={{}}>
        <Outlet />
        <SetUpPassphraseDialog />
        <UnlockBrowserDialog />
        <AppNavigation />
      </BindLogic>
    </BindLogic>
  </BindLogic>
);

export const Route = createRootRoute({ component: RootLayout });
