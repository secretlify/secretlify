import {
  Outlet,
  Link,
  createFileRoute,
  useLocation,
} from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/project")({
  component: ProjectLayout,
});

function ProjectLayout() {
  const location = useLocation();

  // Stable demo id used elsewhere in the app
  const projectIdStorageKey = "secretlify_demo_project_id";
  let demoProjectId = localStorage.getItem(projectIdStorageKey);
  if (!demoProjectId) {
    demoProjectId = Math.random().toString(36).slice(2, 10);
    localStorage.setItem(projectIdStorageKey, demoProjectId);
  }

  const projects = [
    { id: demoProjectId, name: "My Project" },
    { id: "alpha", name: "Alpha" },
    { id: "bravo", name: "Bravo" },
    { id: "charlie", name: "Charlie" },
  ];

  const activeProjectId = location.href.startsWith("/app/project/")
    ? location.href.split("/")[3]
    : undefined;

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="w-full h-full grid grid-cols-[260px_1fr] gap-4 p-3 md:p-6">
        <aside className="h-full overflow-y-auto">
          <div className="h-full rounded-2xl border border-border bg-card/60 backdrop-blur shadow-sm flex flex-col">
            <nav className="p-2 space-y-1">
              {projects.map((project) => {
                const isActive = project.id === activeProjectId;
                return (
                  <Link
                    key={project.id}
                    to="/app/project/$projectId"
                    params={{ projectId: project.id }}
                    className={cn(
                      "block w-full rounded-xl px-3 py-2 text-sm transition",
                      "border border-transparent",
                      isActive
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {project.id}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="h-full min-w-0 flex flex-col overflow-hidden">
          <header className="shrink-0 px-4 md:px-6 py-3 md:py-4">
            <div className="text-sm text-muted-foreground">
              <span className="hover:underline">Projects</span>
              <span className="px-2">/</span>
              <span className="text-foreground font-medium">
                {activeProjectId ?? "Select a project"}
              </span>
            </div>
          </header>
          <main className="grow overflow-y-auto">
            <div className="px-2 md:px-4 pb-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
