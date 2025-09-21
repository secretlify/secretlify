import { useValues } from "kea";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { DesktopProjectsList } from "./DesktopProjectsList";
import { DesktopProjectTile } from "./DesktopProjectTile";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { Button } from "@/components/ui/button";
import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import { Meh } from "lucide-react";
import { useProjects } from "@/lib/hooks/useProjects";

export function DesktopProjectView() {
  const { projectsLoading, projects } = useValues(projectsLogic);
  const { activeProject } = useProjects();
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
        <div className="mx-auto max-w-7xl h-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-8">
          <aside className="h-full overflow-y-auto flex flex-col justify-center">
            <DesktopProjectsList />
          </aside>

          <main className="h-full overflow-y-auto flex items-center">
            <AnimatePresence mode="popLayout">
              <DesktopProjectTile key={activeProject?.id || "no-project"} />
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
