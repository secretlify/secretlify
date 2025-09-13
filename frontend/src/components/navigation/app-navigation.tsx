import { FloatingDock } from "./floating-dock";
import { Home, LogIn, ScanFaceIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { memo } from "react";

function AppNavigationImpl() {
  const isAppRoute = true;
  const navItems = [
    {
      title: "Home",
      icon: (
        <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Login",
      icon: (
        <LogIn className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/app/login",
    },
    {
      title: "Me",
      icon: (
        <ScanFaceIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/app/me",
    },
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
            ease: "easeOut",
          }}
        >
          <FloatingDock items={navItems} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const AppNavigation = memo(AppNavigationImpl);
