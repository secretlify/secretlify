import { cn, getRelativeTime } from "@/lib/utils";
import { useValues, useActions } from "kea";
import { projectTileLogic } from "@/lib/logics/projectLogic";
import { DiffEditor } from "@/components/app/project/DiffEditor";
import { useEffect, useState } from "react";

export function DesktopHistoryView() {
  const { patches, selectedHistoryChangeId, projectVersionsLoading } =
    useValues(projectTileLogic);
  const { selectHistoryChange } = useActions(projectTileLogic);

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
    <div className="h-full flex gap-4">
      {/* Left side - List of changes */}
      <div className="w-80 flex flex-col bg-card rounded-xl">
        <div className="flex-1 overflow-y-auto custom-scrollbar pl-2 pt-2">
          <div className="space-y-1">
            {patches.map((patch) => (
              <button
                key={patch.id}
                onClick={() => {
                  selectHistoryChange(patch.id, patch.content);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer",
                  selectedHistoryChangeId === patch.id
                    ? "bg-primary/10 border border-primary/20"
                    : "border border-transparent hover:bg-muted/20"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <img
                      src={patch.author.avatarUrl || DEFAULT_AVATAR}
                      alt={patch.author.email}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                    <p className="text-sm font-medium truncate flex-1 min-w-0">
                      {patch.author.email}
                    </p>
                  </div>
                  <span
                    className="text-xs text-muted-foreground whitespace-nowrap"
                    title={formatDate(patch.createdAt)}
                  >
                    {getRelativeTime(patch.createdAt)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Diff editor */}
      <div className="flex-1 bg-editor rounded-xl overflow-hidden">
        {selectedPatch ? (
          <DiffEditor value={selectedPatch} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              Select a version to view changes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format date for tooltip
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Default avatar URL
const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/a/ACg8ocLTdCSYO1ZsGrEcdHjKzsoi-ZM1fFd8TqoezaiIQXAe3AUwcQ=s96-c";
