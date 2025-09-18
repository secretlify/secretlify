import { useState } from "react";
import { DiffEditor } from "@/components/app/project/DiffEditor";
import { cn } from "@/lib/utils";

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

// Dummy data for demonstration
const dummyHistory: HistoryChange[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    date: "2025-09-17T14:23:00",
    avatar: DEFAULT_AVATAR,
    changes: `# Database Configuration
- DB_HOST=localhost
+ DB_HOST=production.db.server
- DB_PORT=5432
+ DB_PORT=5433
  DB_NAME=myapp
- DB_USER=developer
+ DB_USER=prod_user
  
# API Keys
  API_KEY=sk-1234567890
+ API_SECRET=secret_key_production
  
# Feature Flags
- FEATURE_NEW_UI=false
+ FEATURE_NEW_UI=true
+ FEATURE_ANALYTICS=true`,
  },
  {
    id: "2",
    email: "alice.smith@example.com",
    date: "2025-09-16T09:45:00",
    avatar: DEFAULT_AVATAR,
    changes: `# Redis Configuration
+ REDIS_HOST=redis.local
+ REDIS_PORT=6379
+ REDIS_PASSWORD=redis_pass_123
  
# Database Configuration
  DB_HOST=production.db.server
  DB_PORT=5433
  DB_NAME=myapp
  DB_USER=prod_user
  
# API Keys
  API_KEY=sk-1234567890
- API_SECRET=old_secret_key
+ API_SECRET=secret_key_production`,
  },
  {
    id: "3",
    email: "bob.wilson@example.com",
    date: "2025-09-15T18:12:00",
    avatar: DEFAULT_AVATAR,
    changes: `# Application Settings
- APP_ENV=development
+ APP_ENV=production
- DEBUG=true
+ DEBUG=false
  
# Database Configuration
  DB_HOST=production.db.server
  DB_PORT=5433
  DB_NAME=myapp
  DB_USER=prod_user
  
# Email Configuration
+ SMTP_HOST=smtp.gmail.com
+ SMTP_PORT=587
+ SMTP_USER=noreply@example.com`,
  },
  {
    id: "4",
    email: "sarah.johnson@example.com",
    date: "2025-09-14T11:30:00",
    avatar: DEFAULT_AVATAR,
    changes: `# Application Settings
  APP_ENV=production
  DEBUG=false
  
# Security
+ JWT_SECRET=super_secret_jwt_key_2025
+ JWT_EXPIRY=3600
  
# Database Configuration
  DB_HOST=production.db.server
  DB_PORT=5433
  DB_NAME=myapp
  DB_USER=prod_user
  
# Monitoring
+ SENTRY_DSN=https://sentry.io/project
+ SENTRY_ENVIRONMENT=production`,
  },
  {
    id: "5",
    email: "mike.chen@example.com",
    date: "2025-09-13T16:45:00",
    avatar: DEFAULT_AVATAR,
    changes: `# Initial project setup
+ # Database Configuration
+ DB_HOST=localhost
+ DB_PORT=5432
+ DB_NAME=myapp
+ DB_USER=developer
+ 
+ # Application Settings
+ APP_ENV=development
+ DEBUG=true
+ 
+ # API Keys
+ API_KEY=sk-1234567890`,
  },
];

export function HistoryViewer() {
  const [selectedChange, setSelectedChange] = useState(dummyHistory[0]);

  return (
    <div className="h-full grid grid-cols-[320px_1fr] gap-4">
      {/* Left column - Changes list */}
      <div className="h-full overflow-y-auto pr-2 space-y-2">
        {dummyHistory.map((change) => (
          <button
            key={change.id}
            onClick={() => setSelectedChange(change)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-xl border transition",
              selectedChange.id === change.id
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
          <DiffEditor value={selectedChange.changes} />
        </div>
      </div>
    </div>
  );
}
