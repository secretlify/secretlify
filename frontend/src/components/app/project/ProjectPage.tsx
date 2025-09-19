import { ProjectsList } from "@/components/app/project/ProjectsList";
import { ProjectEditor } from "@/components/app/project/ProjectEditor/ProjectEditor";
import { useParams } from "@tanstack/react-router";
import { BindLogic } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";

export function ProjectPage() {
  const projectId = useParams({
    from: "/app/project/$projectId",
  });

  return (
    <BindLogic logic={projectLogic} props={{ projectId: projectId.projectId }}>
      <ProjectPageContent />
    </BindLogic>
  );
}

function ProjectPageContent() {
  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground flex items-center justify-center px-8">
      <div className="h-screen w-full overflow-hidden bg-background text-foreground">
        <div className="mx-auto max-w-7xl h-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-8">
          <aside className="h-full overflow-y-auto flex flex-col justify-center">
            <ProjectsList />
          </aside>

          <main className="h-full overflow-y-auto flex items-center">
            <ProjectEditor />
          </main>
        </div>
      </div>
    </div>
  );
}
