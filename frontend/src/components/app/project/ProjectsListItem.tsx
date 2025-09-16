import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Project, ProjectsApi } from "@/lib/api/projects.api";
import { useState } from "react";
import { useActions, useValues } from "kea";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { authLogic } from "@/lib/logics/authLogic";

interface ProjectsListItemProps {
  project: Project;
  isActive: boolean;
}

export function ProjectsListItem({ project, isActive }: ProjectsListItemProps) {
  const { jwtToken } = useValues(authLogic);
  const { loadProjects } = useActions(projectsLogic);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (isDeleting) return;
    setIsDeleting(true);
    await ProjectsApi.deleteProject(jwtToken!, project.id);
    await loadProjects();
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition border",
        isActive
          ? "bg-primary/10 text-primary border-primary/20"
          : "border-transparent hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Link
        to="/app/project/$projectId"
        params={{ projectId: project.id }}
        className="flex-1 min-w-0"
      >
        <span className="font-medium truncate block">{project.name}</span>
      </Link>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={`Delete project ${project.name}`}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
        onClick={onDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
      </Button>
    </div>
  );
}

export default ProjectsListItem;
