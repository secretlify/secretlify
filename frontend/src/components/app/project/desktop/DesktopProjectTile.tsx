import { FileEditor } from "@/components/app/project/FileEditor";
import { UpdateButton } from "@/components/app/project/SaveButton";
import { DesktopHistoryView } from "@/components/app/project/desktop/DesktopHistoryView";
import { IntegrationsDialog } from "@/components/dialogs/IntegrationsDialog";
import { ProjectAccessDialog } from "@/components/dialogs/ProjectAccessDialog";
import { ProjectSettingsDialog } from "@/components/dialogs/ProjectSettingsDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authLogic } from "@/lib/logics/authLogic";
import { commonLogic } from "@/lib/logics/commonLogic";
import { projectLogic } from "@/lib/logics/projectLogic";
import { getRelativeTime } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandGithub,
  IconHistory,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { useActions, useValues } from "kea";
import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export function DesktopProjectTile() {
  const {
    projectData,
    isShowingHistory,
    isSubmitting,
    isEditorDirty,
    inputValue,
    lastEditAuthor,
    isExternallyUpdated,
  } = useValues(projectLogic);
  const { userData } = useValues(authLogic);
  const { updateProjectContent, setInputValue } = useActions(projectLogic);
  const [_currentTime, setCurrentTime] = useState(Date.now()); // eslint-disable-line @typescript-eslint/no-unused-vars

  const changedBy = useMemo(() => {
    if (lastEditAuthor?.id === userData?.id) {
      return "you";
    }

    if (!lastEditAuthor) {
      return null;
    }

    return lastEditAuthor?.email;
  }, [lastEditAuthor, userData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        if (
          !isSubmitting &&
          isEditorDirty &&
          !isShowingHistory &&
          !isExternallyUpdated
        ) {
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
    isExternallyUpdated,
  ]);

  // Update the current time every second to refresh the relative time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!projectData) {
    return (
      <div className="h-[65vh] rounded-2xl border border-border bg-card/60 backdrop-blur">
        <div className="h-full flex flex-col p-4 gap-4">
          <ProjectHeaderSkeleton />
          <div className="relative rounded-xl overflow-hidden bg-editor h-full">
            <div className="h-full p-6">
              <EditorSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[65vh] rounded-2xl border border-border bg-card/60 backdrop-blur">
      <div className="h-full flex flex-col p-4 gap-4">
        <ProjectHeader />
        <div className="relative rounded-xl overflow-hidden h-full">
          {isShowingHistory ? (
            <DesktopHistoryView />
          ) : (
            <div className="h-full">
              <FileEditor
                value={inputValue}
                onChange={(v) => setInputValue(v)}
              />
              <AnimatePresence mode="wait">
                {" "}
                {changedBy && (
                  <motion.div
                    className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ ease: "easeInOut", duration: 0.1 }}
                  >
                    <span className="rounded bg-background/80 px-2 py-0.5 text-xs text-muted-foreground shadow-sm">
                      Changed by {changedBy.split("@")[0]}{" "}
                      {getRelativeTime(projectData.updatedAt)}
                    </span>
                  </motion.div>
                )}{" "}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectHeader() {
  const { projectData, isShowingHistory, isExternallyUpdated } =
    useValues(projectLogic);

  const { toggleHistoryView } = useActions(projectLogic);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [integrationsDialogOpen, setIntegrationsDialogOpen] = useState(false);

  const { shouldReopenIntegrationsDialog } = useValues(commonLogic);
  const { setShouldReopenIntegrationsDialog } = useActions(commonLogic);

  useEffect(() => {
    if (shouldReopenIntegrationsDialog) {
      setShouldReopenIntegrationsDialog(false);

      setTimeout(() => {
        setIntegrationsDialogOpen(true);
      }, 500);
    }
  }, []);

  return (
    <div className="relative flex h-10 items-center justify-center">
      {/* Left buttons - fixed width */}
      <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {isShowingHistory ? (
          <div className="relative group">
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleHistoryView}
              aria-label="Go back"
              className="cursor-pointer"
            >
              <IconArrowLeft className="size-5" />
            </Button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              <div className="font-medium">Go back</div>
              <div className="text-xs text-muted-foreground">
                Return to editor
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative group">
              <Button
                variant={isShowingHistory ? "default" : "ghost"}
                size="lg"
                onClick={toggleHistoryView}
                aria-label={
                  isShowingHistory ? "Exit history mode" : "View history"
                }
                className="cursor-pointer"
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
            <div className="relative group">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShareDialogOpen(true)}
                aria-label="Share project"
                className="cursor-pointer"
              >
                <IconUsers className="size-5" />
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">Members</div>
                <div className="text-xs text-muted-foreground">
                  Invite members
                </div>
              </div>
            </div>
            <div className="relative group">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setSettingsDialogOpen(true)}
                aria-label="Project settings"
                className="cursor-pointer"
              >
                <IconSettings className="size-5" />
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">Settings</div>
                <div className="text-xs text-muted-foreground">
                  Project settings
                </div>
              </div>
            </div>
            <div className="relative group">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIntegrationsDialogOpen(true)}
                aria-label="Integrations"
                className="cursor-pointer"
              >
                <IconBrandGithub className="size-5" />
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">Integrations</div>
                <div className="text-xs text-muted-foreground">
                  Connect github repositories
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Center - project name with proper truncation */}
      <div className="w-[50%] flex min-w-0 items-center justify-center gap-4">
        <div className="h-px w-6 flex-shrink-0 bg-border"></div>
        <h1 className="min-w-0 truncate text-2xl font-semibold tracking-wide text-foreground/90">
          {projectData?.name}
        </h1>
        <div className="h-px w-6 flex-shrink-0 bg-border"></div>
      </div>

      {/* Right button - fixed width */}
      <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-4">
        {isExternallyUpdated && (
          <div className="relative group/tooltip">
            <AlertTriangle className="size-5 text-amber-500" />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-m bg-black text-white text-sm rounded-md py-2 px-3 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
              <p className="font-medium">
                This project has just been updated by someone else.
              </p>
              <p className="font-medium">Refresh to get the new content.</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
            </div>
          </div>
        )}
        {!isShowingHistory && <UpdateButton />}
      </div>

      <ProjectAccessDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
      <ProjectSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
      <IntegrationsDialog
        open={integrationsDialogOpen}
        onOpenChange={setIntegrationsDialogOpen}
      />
    </div>
  );
}

function ProjectHeaderSkeleton() {
  const { isShowingHistory } = useValues(projectLogic);
  const { toggleHistoryView } = useActions(projectLogic);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [integrationsDialogOpen, setIntegrationsDialogOpen] = useState(false);

  return (
    <div className="relative flex h-10 items-center justify-center">
      {/* Left buttons - fixed width */}
      <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {isShowingHistory ? (
          <div className="relative group">
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleHistoryView}
              aria-label="Go back"
              className="cursor-pointer"
            >
              <IconArrowLeft className="size-5" />
            </Button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              <div className="font-medium">Go back</div>
              <div className="text-xs text-muted-foreground">
                Return to editor
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative group">
              <Button
                variant={isShowingHistory ? "default" : "ghost"}
                size="lg"
                onClick={toggleHistoryView}
                aria-label={
                  isShowingHistory ? "Exit history mode" : "View history"
                }
                className="cursor-pointer"
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
            <div className="relative group">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShareDialogOpen(true)}
                aria-label="Share project"
                className="cursor-pointer"
              >
                <IconUsers className="size-5" />
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">Members</div>
                <div className="text-xs text-muted-foreground">
                  Invite members
                </div>
              </div>
            </div>
            <div className="relative group">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setSettingsDialogOpen(true)}
                aria-label="Project settings"
                className="cursor-pointer"
              >
                <IconSettings className="size-5" />
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">Settings</div>
                <div className="text-xs text-muted-foreground">
                  Project settings
                </div>
              </div>
            </div>
            <div className="relative group">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIntegrationsDialogOpen(true)}
                aria-label="Integrations"
                className="cursor-pointer"
              >
                <IconBrandGithub className="size-5" />
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">Integrations</div>
                <div className="text-xs text-muted-foreground">
                  Connect github repositories
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Center - project name skeleton */}
      <div className="w-[50%] flex min-w-0 items-center justify-center gap-4">
        <div className="h-px w-6 flex-shrink-0 bg-border"></div>
        <Skeleton className="h-8 w-48 rounded-md" />
        <div className="h-px w-6 flex-shrink-0 bg-border"></div>
      </div>

      {/* Right button - fixed width */}
      <div className="absolute right-0 top-1/2 flex -translate-y-1/2">
        {!isShowingHistory && <UpdateButton />}
      </div>

      <ProjectAccessDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
      <ProjectSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
      <IntegrationsDialog
        open={integrationsDialogOpen}
        onOpenChange={setIntegrationsDialogOpen}
      />
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="space-y-3">
      {/* Create multiple skeleton lines with varying widths to simulate text content */}
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-[85%]" />
      <Skeleton className="h-5 w-[92%]" />
      <Skeleton className="h-5 w-[78%]" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-[88%]" />
      <Skeleton className="h-5 w-[95%]" />
      <Skeleton className="h-5 w-[82%]" />
      <Skeleton className="h-5 w-[90%]" />
      <Skeleton className="h-5 w-[76%]" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-[84%]" />
      <Skeleton className="h-5 w-[91%]" />
      <Skeleton className="h-5 w-[87%]" />
      <Skeleton className="h-5 w-[93%]" />
      <Skeleton className="h-5 w-[79%]" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-[86%]" />
      <Skeleton className="h-5 w-[94%]" />
      <Skeleton className="h-5 w-[81%]" />
      <Skeleton className="h-5 w-[92%]" />
      <Skeleton className="h-5 w-[77%]" />
    </div>
  );
}
