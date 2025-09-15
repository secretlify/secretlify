import { ProjectsList } from "@/components/app/project/ProjectsList";
import { ProjectEditor } from "@/components/app/project/ProjectEditor/ProjectEditor";

export function ProjectPage() {
  return (
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
  );
}
