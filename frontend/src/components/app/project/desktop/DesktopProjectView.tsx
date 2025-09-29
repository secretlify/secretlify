import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import Waves from "@/components/Waves";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { useValues } from "kea";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { DesktopProjectsList } from "./DesktopProjectsList";
import { DesktopProjectTile } from "./DesktopProjectTile";

export function DesktopProjectView() {
  const { projectsLoading, projects } = useValues(projectsLogic);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Automatically open the modal when there are no projects
  useEffect(() => {
    if (!projectsLoading && projects.length === 0) {
      setAddDialogOpen(true);
    }
  }, [projectsLoading, projects.length]);

  if (!projectsLoading && !projects.length) {
    return (
      <div className="h-screen w-full overflow-hidden text-foreground flex items-center justify-center px-8 relative">
        {/* Background Waves */}
        <div className="absolute inset-0 z-0">
          <Waves
            lineColor="rgba(255, 255, 255, 0.3)"
            backgroundColor="transparent"
            waveSpeedX={0.01}
            waveSpeedY={0.005}
            waveAmpX={20}
            waveAmpY={10}
          />
        </div>

        <AddProjectDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground flex items-center justify-center px-8 relative">
      {/* Background Threads */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Waves
          lineColor="rgba(50, 50, 50, 1)"
          backgroundColor="transparent"
          waveSpeedX={0.01}
          waveSpeedY={0.005}
          waveAmpX={25}
          waveAmpY={25}
        />
      </div>

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
