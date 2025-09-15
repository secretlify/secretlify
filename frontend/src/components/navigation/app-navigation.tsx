import { useLocation } from "@tanstack/react-router";
import { FloatingDock } from "./floating-dock";
import { Home, LogIn, ScanFaceIcon, FileText, Code } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { memo } from "react";
import { authLogic } from "@/lib/logics/authLogic";
import { useValues } from "kea";

function AppNavigationImpl() {
  const location = useLocation();

  const isAppRoute = location.href.startsWith("/app");

  const { isLoggedIn } = useValues(authLogic);

  // Stable random project id stored in localStorage
  const projectIdKey = "secretlify_demo_project_id";
  let projectId = localStorage.getItem(projectIdKey);
  if (!projectId) {
    projectId = Math.random().toString(36).slice(2, 10);
    localStorage.setItem(projectIdKey, projectId);
  }

  const navItems = [
    {
      title: "Home",
      icon: (
        <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Project",
      icon: (
        <FileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: `/app/project/${projectId}`,
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
    // Show Me only when user is logged in
    ...(isLoggedIn
      ? [
          {
            title: "Developer",
            icon: (
              <Code className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/app/developer",
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
