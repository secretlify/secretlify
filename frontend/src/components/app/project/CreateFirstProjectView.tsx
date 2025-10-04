import { AddProjectDialog } from "@/components/dialogs/AddProjectDialog";
import { Button } from "@/components/ui/button";
import { authLogic } from "@/lib/logics/authLogic";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { IconFolder, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useValues } from "kea";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function CreateFirstProjectView() {
  const navigate = useNavigate();
  const { projects, projectsLoading } = useValues(projectsLogic);
  const { isLoggedIn } = useValues(authLogic);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/app/login" });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // Wait for projects to finish loading
    if (projectsLoading) {
      return;
    }

    // If there are projects, navigate to the most recent one
    if (projects.length > 0) {
      // Sort by updatedAt to find the most recent project
      const sortedProjects = [...projects].sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      const targetProjectId = sortedProjects[0].id;

      // Use replace navigation so back button doesn't bounce through this loading page
      navigate({
        to: "/app/project/$projectId",
        params: { projectId: targetProjectId },
        replace: true,
      });
    }
  }, [projects, projectsLoading, navigate]);

  // Show loading state while fetching projects
  if (projectsLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="text-lg text-muted-foreground">
            Loading your projects...
          </span>
        </div>
      </div>
    );
  }

  // Show empty state if no projects
  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  // This shouldn't be visible since we navigate away in useEffect,
  // but keep it for edge cases
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="text-lg text-muted-foreground">
          Redirecting to your project...
        </span>
      </div>
    </div>
  );
}

function EmptyProjectsState() {
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0, 1, 0, 1] },
    },
  } as const;

  const handleCreateProject = () => {
    setIsAddProjectDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-card rounded-xl shadow-lg border border-border p-12">
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-muted rounded-full">
                <IconFolder className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-card-foreground mb-4">
              No projects yet
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Get started by creating your first project. Store and manage your
              encrypted secrets securely.
            </p>

            {/* CTA Button */}
            <motion.div
              animate={{ scale: isButtonHovered ? 1.05 : 1 }}
              transition={{
                scale: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                },
              }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsButtonHovered(true)}
              onHoverEnd={() => setIsButtonHovered(false)}
            >
              <Button
                onClick={handleCreateProject}
                size="lg"
                className="cursor-pointer gap-2 px-8 py-6 text-lg"
              >
                <IconPlus className="w-5 h-5" />
                Create your first project
              </Button>
            </motion.div>

            {/* Add Project Dialog */}
            <AddProjectDialog
              open={isAddProjectDialogOpen}
              onOpenChange={setIsAddProjectDialogOpen}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
