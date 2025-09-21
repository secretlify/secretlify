import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FileEditor } from "@/components/app/project/FileEditor";
import { UpdateButton } from "@/components/app/project/SaveButton";
import { HistoryView } from "@/components/app/project/HistoryView";
import { useActions, useValues } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";
import { Button } from "@/components/ui/button";
import { IconHistory, IconUsers, IconBug } from "@tabler/icons-react";
import { ProjectAccessDialog } from "@/components/dialogs/ProjectAccessDialog";
import { getRelativeTime } from "@/lib/utils";

const hardcoreEase = [0, 1, 0, 1] as const;
const differentEase = [0, 0.7, 0.3, 1] as const;

const transitionPresets = {
  A: {
    duration: 1,
    ease: hardcoreEase,
  },
  B: {
    opacity: { duration: 0.2, ease: "easeInOut" as const },
    x: { duration: 1, ease: hardcoreEase },
    scale: { duration: 1, ease: hardcoreEase },
  },
  C: {
    opacity: { duration: 0.2, ease: "easeInOut" as const },
    x: { duration: 1, ease: differentEase },
    scale: { duration: 1, ease: differentEase },
  },
  D: {
    opacity: { duration: 0.1, ease: "easeInOut" as const },
    x: { duration: 1, ease: hardcoreEase },
    scale: { duration: 1, ease: hardcoreEase },
  },
};

export function DesktopProjectTile() {
  const {
    projectData,
    isShowingHistory,
    isSubmitting,
    isEditorDirty,
    inputValue,
  } = useValues(projectLogic);
  const { updateProjectContent, setInputValue } = useActions(projectLogic);
  const [showDebug, setShowDebug] = useState(false);
  const [selectedTransition, setSelectedTransition] =
    useState<keyof typeof transitionPresets>("A");
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        if (!isSubmitting && isEditorDirty && !isShowingHistory) {
          updateProjectContent();
        }
      }
      // Toggle debug with Ctrl/Cmd + D
      if ((event.metaKey || event.ctrlKey) && event.key === "d") {
        event.preventDefault();
        setShowDebug((prev) => !prev);
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

  const handleTransitionChange = (
    transitionKey: keyof typeof transitionPresets
  ) => {
    setSelectedTransition(transitionKey);
    setRemountKey((prev) => prev + 1); // Force re-mount to see transition
  };

  if (!projectData) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl px-4 relative">
      <motion.div
        key={remountKey}
        className="rounded-2xl border border-border bg-card/60 backdrop-blur"
        initial={{ opacity: 0, x: -50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        transition={transitionPresets[selectedTransition]}
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
                      key={projectData.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ ease: "easeInOut", duration: 0.1 }}
                      className="rounded bg-background/80 px-2 py-0.5 text-xs text-muted-foreground shadow-sm"
                    >
                      Changed by you {getRelativeTime(projectData.updatedAt)}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed top-4 right-4 bg-background border border-border rounded-lg p-4 shadow-lg z-50 min-w-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <IconBug className="size-4" />
            <span className="text-sm font-semibold">Transition Debug</span>
          </div>
          <div className="space-y-2">
            {Object.keys(transitionPresets).map((key) => (
              <button
                key={key}
                onClick={() =>
                  handleTransitionChange(key as keyof typeof transitionPresets)
                }
                className={`w-full text-left px-3 py-2 text-sm rounded border ${
                  selectedTransition === key
                    ? "bg-accent border-accent-foreground/20"
                    : "hover:bg-accent/50 border-transparent"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
            Press Cmd/Ctrl + D to toggle
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectHeader() {
  const { projectData, isShowingHistory } = useValues(projectLogic);
  const { toggleHistoryView } = useActions(projectLogic);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  return (
    <div className="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-4">
      {/* Left buttons - fixed width */}
      <div className="flex items-center gap-2 justify-self-start">
        <div className="relative group">
          <Button
            variant="ghost"
            onClick={() => setShareDialogOpen(true)}
            aria-label="Share project"
          >
            <IconUsers className="size-5" />
          </Button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="font-medium">Members</div>
            <div className="text-xs text-muted-foreground">Invite members</div>
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

      {/* Center - project name with proper truncation */}
      <div className="flex items-center gap-4 justify-center min-w-0">
        <div className="h-px w-6 bg-border flex-shrink-0"></div>
        <h1 className="text-2xl font-semibold tracking-wide text-foreground/90 truncate min-w-0">
          {projectData?.name}
        </h1>
        <div className="h-px w-6 bg-border flex-shrink-0"></div>
      </div>

      {/* Right button - fixed width */}
      <div className="flex justify-self-end">
        {!isShowingHistory && <UpdateButton />}
      </div>

      <ProjectAccessDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
}
