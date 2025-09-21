import { cn } from "@/lib/utils";
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

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

export function MobileHistoryView() {
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
    <div className="h-full">
      {/* Top - Version list (30%) */}
      <div className="border-b border-border overflow-y-auto p-3 h-1/3">
        <div className="space-y-2">
          {historyChanges.map((change) => {
            const changeDate = new Date(change.date);
            const isSelected = change.id === selectedHistoryChangeId;

            return (
              <div
                key={change.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors text-sm",
                  isSelected
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                onClick={() => selectHistoryChange(change.id, change.changes)}
              >
                <img
                  src={change.avatar}
                  alt={`Avatar for ${change.email}`}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{change.email}</span>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {changeDate.toLocaleDateString()}
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
