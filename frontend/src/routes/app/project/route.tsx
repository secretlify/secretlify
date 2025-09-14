import {
  Outlet,
  Link,
  createFileRoute,
  useLocation,
} from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

export const Route = createFileRoute("/app/project")({
  component: ProjectLayout,
});

function ProjectLayout() {
  const location = useLocation();

  const [projects, setProjects] = useState([
    { id: "alpha", name: "Alpha" },
    { id: "bravo", name: "Bravo" },
    { id: "charlie", name: "Charlie" },
    { id: "delta", name: "Delta" },
  ]);

  const activeProjectId = location.href.startsWith("/app/project/")
    ? location.href.split("/")[3]
    : undefined;

  const containerVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.5 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  } as const;

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
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
            layout="position"
          >
            <div className="px-2 py-2 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-semibold text-muted-foreground tracking-wide shrink-0">
                Projects
              </h2>
              <button
                type="button"
                aria-label="Add project"
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-md",
                  "border border-border bg-secondary text-secondary-foreground",
                  "hover:bg-secondary/80 transition"
                )}
                onClick={() =>
                  setProjects((prev) => [
                    ...prev,
                    { id: Math.random().toString(36).slice(2, 8), name: "new" },
                  ])
                }
              >
                +
              </button>
            </div>
            <motion.nav className="space-y-1" variants={listVariants} layout>
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
