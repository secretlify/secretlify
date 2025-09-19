import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { FileEditor } from "@/components/app/project/FileEditor";
import { UpdateButton } from "@/components/app/project/UpdateButton";
import { HistoryView } from "@/components/app/project/HistoryView";
import { useActions, useValues } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";
import { Button } from "@/components/ui/button";
import { IconHistory, IconShare } from "@tabler/icons-react";

export function ProjectTile() {
  const {
    projectData,
    isShowingHistory,
    isSubmitting,
    isEditorDirty,
    inputValue,
  } = useValues(projectLogic);
  const { updateProjectContent, setInputValue } = useActions(projectLogic);

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

  if (!projectData) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl px-4">
      <motion.div
        className="rounded-2xl border border-border bg-card/60 backdrop-blur"
        initial={{ opacity: 0, x: -50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        transition={{ duration: 1, ease: [0, 1, 0, 1] }}
      >
        <div className="p-4">
          <ProjectHeader />
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ height: "55vh" }}
          >
            {isShowingHistory ? (
              <HistoryView />
            ) : (
              <div className="h-full">
                <FileEditor
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
        </div>
      </motion.div>
    </div>
  );
}

function ProjectHeader() {
  const { projectData, isShowingHistory } = useValues(projectLogic);
  const { toggleHistoryView } = useActions(projectLogic);

  return (
    <div className="mb-3 relative flex items-center justify-center gap-4">
      <div className="absolute left-0 flex items-center gap-2">
        <div className="relative group">
          <Button variant="ghost" disabled aria-label="Share project">
            <IconShare className="size-5" />
          </Button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="font-medium">Share Project</div>
            <div className="text-xs text-muted-foreground">coming soon</div>
          </div>
        </div>
        <div className="relative group">
          <Button
            variant={isShowingHistory ? "default" : "ghost"}
            onClick={toggleHistoryView}
            aria-label={isShowingHistory ? "Exit history mode" : "View history"}
          >
            <IconHistory className="size-5" />
          </Button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="font-medium">
              {isShowingHistory ? "Exit History Mode" : "View History"}
            </div>
            <div className="text-xs text-muted-foreground">
              {isShowingHistory
                ? "Return to edit mode"
                : "View version history"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-px w-6 bg-border"></div>
        <h1 className="text-2xl font-semibold tracking-wide text-foreground/90 whitespace-nowrap">
          {projectData?.name}
        </h1>
        <div className="h-px w-6 bg-border"></div>
      </div>
      <div className="absolute right-0">
        {!isShowingHistory && <UpdateButton />}
      </div>
    </div>
  );
}
