import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import { useProjects } from "@/lib/hooks/useProjects";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { useValues } from "kea";
import { motion } from "motion/react";
import { useState } from "react";
import DesktopProjectsListItem from "./DesktopProjectsListItem";

export function DesktopProjectsList() {
  const { projects, projectsLoading } = useValues(projectsLogic);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { activeProject } = useProjects();

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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout="position"
    >
      <motion.h2
        className="font-semibold text-muted-foreground tracking-wide text-center mb-2 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0, 1, 0, 1], delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-2">
          <span>Projects</span>
          <span className="text-sm">({projects.length})</span>
        </div>
      </motion.h2>
      <motion.div
        className="max-h-[65vh] rounded-2xl border border-border bg-card/60 backdrop-blur p-3 shadow-sm overflow-y-auto custom-scrollbar"
        layout="position"
      >
        <motion.nav className="space-y-2" variants={listVariants} layout>
          {projects.map((project) => {
            const isActive = project.id === activeProject?.id;

            return (
              <motion.div key={project.id} variants={itemVariants} layout>
                <DesktopProjectsListItem
                  project={project}
                  isActive={isActive}
                />
              </motion.div>
            );
          })}
        </motion.nav>
      </motion.div>
      <AddProjectDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <motion.div
        className="mt-2"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0, 1, 0, 1], delay: 0.2 }}
      >
        <button
          type="button"
          aria-label="Add project"
          className="w-full text-center text-xs text-muted-foreground hover:underline cursor-pointer"
          onClick={() => setAddDialogOpen(true)}
        >
          Add project
        </button>
      </motion.div>
    </motion.div>
  );
}
