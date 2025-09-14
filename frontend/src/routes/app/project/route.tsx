import {
  Outlet,
  Link,
  createFileRoute,
  useLocation,
} from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

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

  const containerVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
  } as const;

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.02, delayChildren: 0.05 } },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 },
    },
  } as const;

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="mx-auto max-w-7xl h-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-8">
        <aside className="h-full overflow-y-auto flex flex-col justify-center">
          <motion.div
            className="rounded-2xl border border-border bg-card/60 backdrop-blur p-3 shadow-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
          >
            <div className="px-2 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground tracking-wide">
                Projects
              </h2>
            </div>
            <motion.nav className="space-y-1" variants={listVariants}>
              {projects.map((project) => {
                const isActive = project.id === activeProjectId;
                return (
                  <motion.div key={project.id} variants={itemVariants} layout>
                    <Link
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
                  </motion.div>
                );
              })}
            </motion.nav>
          </motion.div>
        </aside>

        <main className="h-full overflow-y-auto flex items-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
