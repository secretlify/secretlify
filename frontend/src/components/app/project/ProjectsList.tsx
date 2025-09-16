import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useValues } from "kea";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { useProjects } from "@/lib/hooks/useProjects";
import { useEffect, useState } from "react";
import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import ProjectsListItem from "@/components/app/project/ProjectsListItem";

export function ProjectsList() {
  const { projects, projectsLoading } = useValues(projectsLogic);
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { activeProject } = useProjects();

  useEffect(() => {
    if (
      projects.length &&
      !projects.find((project) => project.id === activeProject?.id)
    ) {
      navigate({
        to: "/app/project/$projectId",
        params: { projectId: projects[0].id },
      });
    }
  }, [projects]);

  const containerVariants = {
    hidden: { opacity: 0, y: 300, scale: 0.5 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: [0, 1, 0, 1] },
    },
  } as const;

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 },
    },
  } as const;

  if (!projects.length && projectsLoading) {
    return null;
  }

  return (
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
          onClick={() => setAddDialogOpen(true)}
        >
          +
        </button>
      </div>
      <AddProjectDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <motion.nav className="space-y-1" variants={listVariants} layout>
        {projects.map((project) => {
          const isActive = project.id === activeProject?.id;
          return (
            <motion.div key={project.id} variants={itemVariants} layout>
              <ProjectsListItem project={project} isActive={isActive} />
            </motion.div>
          );
        })}
      </motion.nav>
    </motion.div>
  );
}
