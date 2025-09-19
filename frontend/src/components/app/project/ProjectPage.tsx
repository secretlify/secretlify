import { ProjectsList } from "@/components/app/project/ProjectsList";
import { ProjectEditor } from "@/components/app/project/ProjectEditor/ProjectEditor";
import { HistorySidePanel } from "@/components/app/project/HistorySidePanel";
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
      {/* Centered container for editor with relative positioning for side panels */}
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        {/* Projects list - positioned absolutely to the left of editor */}
        <aside className="hidden lg:block absolute left-0 -translate-x-[calc(100%+2rem)] w-[280px]">
          <ProjectsList />
        </aside>

        {/* Editor - centered and responsive */}
        <ProjectEditor />

        {/* History panel - positioned absolutely to the right of editor */}
        <aside className="hidden lg:block absolute right-0 translate-x-[calc(100%+2rem)] w-[280px]">
          <HistorySidePanel />
        </aside>
      </div>
    </div>
  );
}
