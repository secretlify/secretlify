import { useState } from "react";
import { IconUser, IconCalendar } from "@tabler/icons-react";
import { DiffEditor } from "@/components/app/project/DiffEditor";
import { cn } from "@/lib/utils";

interface HistoryChange {
  id: string;
  email: string;
  date: string;
  changes: string;
}

// Dummy data for demonstration
const dummyHistory: HistoryChange[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    date: "2025-09-17 14:23",
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
    date: "2025-09-16 09:45",
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
    date: "2025-09-15 18:12",
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
    date: "2025-09-14 11:30",
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
    date: "2025-09-13 16:45",
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
              "w-full text-left p-3 rounded-xl border transition",
              selectedChange.id === change.id
                ? "bg-primary/10 text-primary border-primary/20"
                : "border-transparent hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-primary/10">
                  <IconUser className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm font-medium truncate">{change.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-muted">
                  <IconCalendar className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{change.date}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Right column - Diff viewer */}
      <div className="h-full overflow-hidden">
        <div className="h-full rounded-xl border border-border/50 bg-card/50 overflow-hidden">
          <DiffEditor value={selectedChange.changes} />
        </div>
      </div>
    </div>
  );
}
