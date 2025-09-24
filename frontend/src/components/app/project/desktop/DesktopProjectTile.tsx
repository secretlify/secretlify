import { FileEditor } from "@/components/app/project/FileEditor";
import { UpdateButton } from "@/components/app/project/SaveButton";
import { DesktopHistoryView } from "@/components/app/project/desktop/DesktopHistoryView";
import { ProjectAccessDialog } from "@/components/dialogs/ProjectAccessDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { projectLogic } from "@/lib/logics/projectLogic";
import { getRelativeTime } from "@/lib/utils";
import { IconArrowLeft, IconHistory, IconUsers } from "@tabler/icons-react";
import { useActions, useValues } from "kea";
import { useEffect, useState } from "react";

export function DesktopProjectTile() {
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
    return (
      <div className="p-4">
        <ProjectHeaderSkeleton />
        <div
          className="relative rounded-xl overflow-hidden bg-card/30"
          style={{ height: "55vh" }}
        >
          <div className="h-full p-6">
            <EditorSkeleton />
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
              <Skeleton className="h-6 w-32 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur">
      <div className="p-4">
        <ProjectHeader />
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ height: "55vh" }}
        >
          {isShowingHistory ? (
            <DesktopHistoryView />
          ) : (
            <div className="h-full">
              <FileEditor
                value={inputValue}
                onChange={(v) => setInputValue(v)}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
                <span className="rounded bg-background/80 px-2 py-0.5 text-xs text-muted-foreground shadow-sm">
                  Changed by you {getRelativeTime(projectData.updatedAt)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
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
      <div className="flex items-center gap-2 justify-self-start -m-2 p-2">
        {isShowingHistory ? (
          <div className="relative group">
            <Button
              variant="ghost"
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
          </>
        )}
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

function ProjectHeaderSkeleton() {
  return (
    <div className="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-4">
      {/* Left buttons - fixed width */}
      <div className="flex items-center gap-2 justify-self-start">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      {/* Center - project name skeleton */}
      <div className="flex items-center gap-4 justify-center min-w-0">
        <div className="h-px w-6 bg-border flex-shrink-0"></div>
        <Skeleton className="h-8 w-48 rounded-md" />
        <div className="h-px w-6 bg-border flex-shrink-0"></div>
      </div>

      {/* Right button - fixed width */}
      <div className="flex justify-self-end">
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
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
    </div>
  );
}
