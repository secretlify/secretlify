import { useState, useEffect } from "react";
import { DiffEditor } from "@/components/app/project/DiffEditor";
import { cn } from "@/lib/utils";
import { useValues } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";

interface HistoryChange {
  id: string;
  email: string;
  date: string;
  changes: string;
  avatar?: string;
}

// Helper function to calculate relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes === 0) {
        return "just now";
      }
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else if (diffInDays === 1) {
    return "yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }
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

export function HistoryViewer() {
  const { patches } = useValues(projectLogic);

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

  const [selectedChange, setSelectedChange] = useState<HistoryChange | null>(
    historyChanges[0] || null
  );

  // Update selected change when patches change
  useEffect(() => {
    if (historyChanges.length > 0 && !selectedChange) {
      setSelectedChange(historyChanges[0]);
    }
  }, [historyChanges, selectedChange]);

  // Handle empty state
  if (!historyChanges.length) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No version history available</p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-[320px_1fr] gap-4">
      {/* Left column - Changes list */}
      <div className="h-full overflow-y-auto pr-2 space-y-2">
        {historyChanges.map((change) => (
          <button
            key={change.id}
            onClick={() => setSelectedChange(change)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-xl border transition",
              selectedChange?.id === change.id
                ? "bg-primary/10 text-primary border-primary/20"
                : "border-transparent hover:bg-accent hover:text-accent-foreground"
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
                ({getRelativeTime(change.date)})
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Right column - Diff viewer */}
      <div className="h-full overflow-hidden">
        <div className="h-full rounded-xl overflow-hidden">
          {selectedChange ? (
            <DiffEditor value={selectedChange.changes} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Select a change to view differences</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
