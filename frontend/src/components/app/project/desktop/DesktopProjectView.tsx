import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import { Button } from "@/components/ui/button";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { useValues } from "kea";
import { Meh } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DesktopProjectsList } from "./DesktopProjectsList";
import { DesktopProjectTile } from "./DesktopProjectTile";

export function DesktopProjectView() {
  const { projectsLoading, projects } = useValues(projectsLogic);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  if (!projectsLoading && !projects.length) {
    return (
      <div className="h-screen w-full overflow-hidden bg-background text-foreground flex items-center justify-center px-8">
        <div className="text-center">
          <Meh className="size-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-md text-muted-foreground/60 mb-6">
            Oops. There are no projects.
          </p>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="cursor-pointer"
          >
            Create project
          </Button>
        </div>

        <AddProjectDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground flex items-center justify-center px-8">
      <div className="h-screen w-full overflow-hidden bg-background text-foreground">
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
                delay: 0.5,
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
