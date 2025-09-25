import { type Project, ProjectsApi } from "@/lib/api/projects.api";
import { authLogic } from "@/lib/logics/authLogic";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useActions, useValues } from "kea";
import { useState } from "react";

interface DesktopProjectsListItemProps {
  project: Project;
  isActive: boolean;
}

export function DesktopProjectsListItem({
  project,
  isActive,
}: DesktopProjectsListItemProps) {
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
        "group relative flex items-center justify-between rounded-xl px-3 py-2 text-sm transition border",
        isActive
          ? "bg-primary/10 text-primary border-primary/20"
          : "border-transparent hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Link
        to="/app/project/$projectId"
        params={{ projectId: project.id }}
        aria-label={`Open project ${project.name}`}
        className="absolute inset-0 rounded-xl"
      />
      <div className="flex-1 min-w-0 pointer-events-none">
        <span className="font-medium truncate block">{project.name}</span>
      </div>
    </div>
  );
}

export default DesktopProjectsListItem;
