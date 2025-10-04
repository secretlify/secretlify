import { motion } from "motion/react";
import { DesktopProjectsList } from "./DesktopProjectsList";
import { DesktopProjectTile } from "./DesktopProjectTile";

export function DesktopProjectView() {
  return (
    <div className="h-screen w-full overflow-hidden text-foreground flex items-center justify-center px-8 relative">
      {/* Content */}
      <div className="h-screen w-full overflow-hidden text-foreground relative z-10">
        <div className="mx-auto max-w-7xl h-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-2 p-4 md:p-8">
          <aside className="h-full overflow-y-auto flex flex-col justify-center">
            <DesktopProjectsList />
          </aside>

          <main className="h-full overflow-y-auto flex items-center">
            <motion.div
              className="w-full max-w-5xl px-8 relative"
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{
                duration: 1,
                ease: [0, 1, 0, 1],
                delay: 0.4,
              }}
            >
              <DesktopProjectTile />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
