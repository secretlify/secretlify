import { useState, useEffect } from "react";
import { motion } from "motion/react";
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

export function HistorySidePanel() {
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
  const [showDiff, setShowDiff] = useState(false);

  // Update selected change when patches change
  useEffect(() => {
    if (historyChanges.length > 0 && !selectedChange) {
      setSelectedChange(historyChanges[0]);
    }
  }, [historyChanges, selectedChange]);

  // Handle empty state
  if (!historyChanges.length) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full flex items-center justify-center text-muted-foreground"
      >
        <p>No version history available</p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  } as const;

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03 } },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, x: 16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-[280px] h-full flex flex-col"
    >
      <motion.h2
        className="font-semibold text-muted-foreground tracking-wide text-center mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
      >
        History
      </motion.h2>

      {!showDiff ? (
        // List view
        <motion.div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-3 shadow-sm flex-1 overflow-hidden">
          <motion.nav
            className="space-y-2 h-full overflow-y-auto pr-1"
            variants={listVariants}
          >
            {historyChanges.map((change) => (
              <motion.div key={change.id} variants={itemVariants}>
                <button
                  onClick={() => {
                    setSelectedChange(change);
                    setShowDiff(true);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200",
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
                      {getRelativeTime(change.date)}
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      ) : (
        // Diff view
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col gap-2"
        >
          <button
            onClick={() => setShowDiff(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to list
          </button>
          {selectedChange && (
            <div className="flex-1 rounded-xl overflow-hidden border border-border">
              <DiffEditor value={selectedChange.changes} />
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
