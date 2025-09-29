import { type Project } from "@/lib/api/projects.api";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface DesktopProjectsListItemProps {
  project: Project;
  isActive: boolean;
}

export function DesktopProjectsListItem({
  project,
  isActive,
}: DesktopProjectsListItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center justify-between px-4 py-2.5 rounded-xl transition",
        isActive
          ? "bg-primary/10 backdrop-blur-sm text-primary border border-primary/5"
          : "hover:bg-accent hover:text-accent-foreground"
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
