import { useLocation } from "@tanstack/react-router";
import { FloatingDock } from "./floating-dock";
import { Home, LogIn, ScanFaceIcon, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { memo } from "react";
import { authLogic } from "@/lib/logics/authLogic";
import { useValues } from "kea";

function AppNavigationImpl() {
  const location = useLocation();

  const isAppRoute = location.href.startsWith("/app");

  const { isLoggedIn } = useValues(authLogic);

  const navItems = [
    {
      title: "Home",
      icon: (
        <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    // Show Login only when user is not logged in
    ...(!isLoggedIn
      ? [
          {
            title: "Login",
            icon: (
              <LogIn className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/app/login",
          },
        ]
      : []),
    // Show Projects, Developer, and Me only when user is logged in
    ...(isLoggedIn
      ? [
          {
            title: "Projects",
            icon: (
              <FileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: `/app/project/demo`,
          },
          {
            title: "Me",
            icon: (
              <ScanFaceIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/app/me",
          },
        ]
      : []),
  ];

  return (
    <AnimatePresence>
      {isAppRoute && (
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        >
          <FloatingDock items={navItems} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const AppNavigation = memo(AppNavigationImpl);
