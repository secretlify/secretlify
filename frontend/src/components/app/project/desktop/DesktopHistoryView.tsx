import { cn, getRelativeTime } from "@/lib/utils";
import { useValues, useActions } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";
import { DiffEditor } from "@/components/app/project/DiffEditor";

interface HistoryChange {
  id: string;
  email: string;
  date: string;
  changes: string;
  avatar?: string;
}

export function DesktopHistoryView() {
  const { patches, selectedHistoryChangeId, projectVersionsLoading } =
    useValues(projectLogic);
  const { selectHistoryChange } = useActions(projectLogic);

  // Convert patches to HistoryChange format with hardcoded data
  const historyChanges: HistoryChange[] = patches.map((patch, index) => {
    // Generate dates going backwards from now
    const now = new Date();
    const daysAgo = patches.length - index - 1;
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    return {
      id: `change-${index + 1}`,
      email: "john@doe.com",
      date: date.toISOString(),
      changes: patch,
      avatar: DEFAULT_AVATAR,
    };
  });

  // Get the currently selected patch
  const selectedPatch = historyChanges.find(
    (change) => change.id === selectedHistoryChangeId
  )?.changes;

  // Handle loading state
  if (!historyChanges.length && projectVersionsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading history...</div>
      </div>
    );
  }

  // Handle empty state
  if (!historyChanges.length && !projectVersionsLoading) {
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
            {historyChanges.map((change) => (
              <button
                key={change.id}
                onClick={() => {
                  selectHistoryChange(change.id, change.changes);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer",
                  selectedHistoryChangeId === change.id
                    ? "bg-primary/10 border border-primary/20"
                    : "border border-transparent hover:bg-muted/20"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <img
                      src={change.avatar || DEFAULT_AVATAR}
                      alt={change.email}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                    <p className="text-sm font-medium truncate flex-1 min-w-0">
                      {change.email}
                    </p>
                  </div>
                  <span
                    className="text-xs text-muted-foreground whitespace-nowrap"
                    title={formatDate(change.date)}
                  >
                    {getRelativeTime(change.date)}
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
