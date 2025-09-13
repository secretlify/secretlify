"use client";

import { FloatingDock } from "./floating-dock";
import { Cat, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export function AppNavigation() {
  const pathname = usePathname();
  const isAppRoute = pathname?.startsWith("/app");
  const navItems = [
    {
      title: "Log in",
      icon: (
        <LogIn className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/app/login",
    },
    {
      title: "Page A",
      icon: (
        <Cat className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/app/page-a",
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
