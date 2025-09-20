import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MobileFileEditor } from "./MobileFileEditor";
import { MobileSaveButton } from "./MobileSaveButton";
import { MobileHistoryView } from "./MobileHistoryView";
import { useActions, useValues } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { Button } from "@/components/ui/button";
import { IconHistory, IconShare } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { useProjects } from "@/lib/hooks/useProjects";
import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import { ProjectAccessDialog } from "@/components/dialogs/ProjectAccessDialog";

export function MobileProjectTile() {
  const {
    projectData,
    isShowingHistory,
    isSubmitting,
    isEditorDirty,
    inputValue,
  } = useValues(projectLogic);
  const { projects } = useValues(projectsLogic);
  const { activeProject } = useProjects();
  const { updateProjectContent, setInputValue } = useActions(projectLogic);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        if (!isSubmitting && isEditorDirty && !isShowingHistory) {
          updateProjectContent();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [
    isSubmitting,
    isEditorDirty,
    updateProjectContent,
    inputValue,
    isShowingHistory,
  ]);

  const handleProjectChange = (projectId: string) => {
    navigate({
      to: "/app/project/$projectId",
      params: { projectId },
    });
  };

  return (
    <div className="h-full flex flex-col">
      <MobileProjectHeader
        projects={projects}
        activeProject={activeProject}
        onProjectChange={handleProjectChange}
        isShowingHistory={isShowingHistory}
        projectData={projectData}
      />

      <div className="flex-1">
        <motion.div
          className="bg-card/60 backdrop-blur h-full flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0, 1, 0, 1] }}
        >
          <div className="flex-1 relative">
            {!projectData ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/60 border-t-transparent mb-2"></div>
                  <div className="text-sm text-muted-foreground">
                    Loading project...
                  </div>
                </div>
              </div>
            ) : isShowingHistory ? (
              <MobileHistoryView />
            ) : (
              <div className="h-full">
                <MobileFileEditor
                  value={inputValue}
                  onChange={(v) => setInputValue(v)}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={"edit-mode"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ ease: "easeInOut", duration: 0.1 }}
                      className="rounded bg-background/80 px-2 py-0.5 text-xs text-muted-foreground shadow-sm"
                    >
                      Changed by you 1 week ago
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MobileProjectHeader({
  projects,
  activeProject,
  onProjectChange,
  isShowingHistory,
  projectData,
}: {
  projects: any[];
  activeProject: any;
  onProjectChange: (projectId: string) => void;
  isShowingHistory: boolean;
  projectData: any;
}) {
  const { toggleHistoryView } = useActions(projectLogic);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleSelectChange = (value: string) => {
    if (value === "add-project") {
      setAddDialogOpen(true);
    } else {
      onProjectChange(value);
    }
  };

  return (
    <div className="flex items-center px-4 py-3 border-b border-border bg-card/60 backdrop-blur">
      {/* Left side - History and Share buttons - Fixed width */}
      <div className="w-20 flex justify-start gap-1">
        <Button
          variant={isShowingHistory ? "default" : "ghost"}
          size="sm"
          onClick={toggleHistoryView}
          aria-label={isShowingHistory ? "Exit history mode" : "View history"}
        >
          <IconHistory className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShareDialogOpen(true)}
          aria-label="Share project"
        >
          <IconShare className="size-4" />
        </Button>
      </div>

      {/* Center - Project selector - Fixed width, always centered */}
      <div className="flex-1 flex justify-center">
        <Select
          value={activeProject?.id || ""}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="border-none shadow-none text-lg font-semibold bg-transparent hover:bg-accent/30 cursor-pointer">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem
                key={project.id}
                value={project.id}
                className="cursor-pointer hover:bg-accent/70 focus:bg-accent/70 py-2"
              >
                {project.name}
              </SelectItem>
            ))}
            <SelectItem
              value="add-project"
              className="text-muted-foreground cursor-pointer hover:bg-accent/70 focus:bg-accent/70 py-2"
            >
              + Add new project
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right side - Save button - Fixed width to match left */}
      <div className="w-20 relative h-8 flex items-center">
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          {!isShowingHistory && projectData && <MobileSaveButton />}
        </div>
      </div>
      <AddProjectDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <ProjectAccessDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
}
