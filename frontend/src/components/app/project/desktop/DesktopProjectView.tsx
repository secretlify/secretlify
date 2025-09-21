import { useValues } from "kea";
import { useState } from "react";
import { DesktopProjectsList } from "./DesktopProjectsList";
import { DesktopProjectTile } from "./DesktopProjectTile";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { Button } from "@/components/ui/button";
import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import { Meh } from "lucide-react";
import { motion } from "motion/react";

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
          <Button onClick={() => setAddDialogOpen(true)}>Create project</Button>
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
        <motion.div
          className="mx-auto max-w-7xl h-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 1, 0, 1] }}
        >
          <aside className="h-full overflow-y-auto flex flex-col justify-center">
            <DesktopProjectsList />
          </aside>

          <main className="h-full overflow-y-auto flex items-center">
            <DesktopProjectTile />
          </main>
        </motion.div>
      </div>
    </div>
  );
}
