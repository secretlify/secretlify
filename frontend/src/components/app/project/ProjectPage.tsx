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
      <div className="h-screen w-full overflow-hidden bg-background text-foreground flex items-center justify-center p-4 md:p-8">
        {/* Container that holds both elements and is centered */}
        <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
          {/* Projects list - positioned relative to the centered container */}
          {/* On desktop: absolutely positioned to the left of the editor */}
          {/* On mobile: hidden (or could be shown in a different way if needed) */}
          <aside className="hidden lg:flex absolute left-0 -translate-x-full h-full w-[280px] overflow-y-auto flex-col justify-center pr-6 pl-4">
            <ProjectsList />
          </aside>

          {/* Editor - stays in the center of the container (and screen) */}
          <ProjectEditor />
        </div>
      </div>
    </BindLogic>
  );
}
