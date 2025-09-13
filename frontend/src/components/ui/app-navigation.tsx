import { FloatingDock } from "./floating-dock";
import { LogIn, ScanFaceIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

export function AppNavigation() {
  useEffect(() => {
    console.log("Spawning");
  }, []);

  const isAppRoute = true;
  const navItems = [
    {
      title: "Home",
      icon: (
        <LogIn className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "About",
      icon: (
        <ScanFaceIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/about",
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
