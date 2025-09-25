import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { type Project } from "@/lib/api/projects.api";

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
        "group relative flex items-center justify-between rounded-md px-3 py-3 text-sm transition border",
        isActive
          ? "border-transparent"
          : "border-transparent hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {isActive && (
        <div className="absolute -ml-1 left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r" />
      )}
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
