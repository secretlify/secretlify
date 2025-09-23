import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import { Button } from "@/components/ui/button";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { useValues } from "kea";
import { Meh } from "lucide-react";
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
        <div className="mx-auto max-w-7xl h-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-8">
          <aside className="h-full overflow-y-auto flex flex-col justify-center">
            <DesktopProjectsList />
          </aside>

          <main className="h-full overflow-y-auto flex items-center">
            <DesktopProjectTile />
          </main>
        </div>
      </div>
    </div>
  );
}
