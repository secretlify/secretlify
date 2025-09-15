import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ProjectsList } from "@/components/app/project/ProjectsList";
import { ProjectEditor } from "@/components/app/project/ProjectEditor/ProjectEditor";

export function ProjectPage() {
  const { projectId: activeProjectId } = useParams({
    from: "/app/project/$projectId",
  });

  const [projects, setProjects] = useState([
    { id: "alpha", name: "Alpha" },
    { id: "bravo", name: "Bravo" },
    { id: "charlie", name: "Charlie" },
    { id: "delta", name: "Delta" },
  ]);

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="mx-auto max-w-7xl h-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-8">
        <aside className="h-full overflow-y-auto flex flex-col justify-center">
          <ProjectsList
            projects={projects}
            onAddProject={() =>
              setProjects((prev) => [
                ...prev,
                { id: Math.random().toString(36).slice(2, 8), name: "new" },
              ])
            }
            activeProjectId={activeProjectId}
          />
        </aside>

        <main className="h-full overflow-y-auto flex items-center">
          <ProjectEditor projectId={activeProjectId} />
        </main>
      </div>
    </div>
  );
}
