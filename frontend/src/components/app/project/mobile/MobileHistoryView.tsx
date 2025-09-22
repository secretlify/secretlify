import { cn, getRelativeTime } from "@/lib/utils";
import { useValues, useActions } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";
import { DiffEditor } from "@/components/app/project/DiffEditor";
import { useEffect, useState } from "react";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

export function MobileHistoryView() {
  const { patches, selectedHistoryChangeId, projectVersionsLoading } =
    useValues(projectLogic);
  const { selectHistoryChange } = useActions(projectLogic);

  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get the currently selected patch
  const selectedPatch = patches.find(
    (patch) => patch.id === selectedHistoryChangeId
  )?.content;

  // Handle loading state
  if (!patches.length && projectVersionsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading history...</div>
      </div>
    );
  }

  // Handle empty state
  if (!patches.length && !projectVersionsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground text-center">
          <p>No history available yet.</p>
          <p className="mt-1">Make changes to see version history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Top - Version list (30%) */}
      <div className="border-b border-border overflow-y-auto p-3 h-1/3">
        <div className="space-y-2">
          {patches.map((patch) => {
            const isSelected = patch.id === selectedHistoryChangeId;

            return (
              <div
                key={patch.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors text-sm",
                  isSelected
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                onClick={() => selectHistoryChange(patch.id, patch.content)}
              >
                <img
                  src={patch.author.avatarUrl || DEFAULT_AVATAR}
                  alt={`Avatar for ${patch.author.email}`}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">
                      {patch.author.email}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {getRelativeTime(patch.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom - Diff editor (70%) */}
      <div className="h-2/3">
        {selectedPatch ? (
          <div className="h-full">
            <DiffEditor value={selectedPatch} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>Select a version to see changes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
