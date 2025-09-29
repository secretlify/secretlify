import AddProjectDialog from "@/components/dialogs/AddProjectDialog";
import { useProjects } from "@/lib/hooks/useProjects";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { useValues } from "kea";
import { motion } from "motion/react";
import { useState } from "react";
import DesktopProjectsListItem from "./DesktopProjectsListItem";
import { PlusIcon } from "lucide-react";

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
      className="bg-card/60 backdrop-blur pt-2 rounded-xl border border-border/60 overflow-hidden"
    >
      <motion.h2
        className="text-muted-foreground tracking-wide text-center mb-2 flex items-center justify-between px-4 pr-2 gap-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0, 1, 0, 1], delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-2 text-sm py-1">
          <span>Your Projects</span>
          <span className="text-sm">({projects.length})</span>
        </div>

        <button
          onClick={() => setAddDialogOpen(true)}
          className="cursor-pointer bg-primary/10 rounded-md p-1"
        >
          <PlusIcon className="size-4" />
        </button>
      </motion.h2>
      <motion.div
        className="max-h-[65vh] shadow-sm overflow-y-auto custom-scrollbar p-0.5"
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
    </motion.div>
  );
}
