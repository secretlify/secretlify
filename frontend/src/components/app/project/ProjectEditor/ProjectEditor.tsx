import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FileEditor } from "@/components/app/project/ProjectEditor/FileEditor";
import { UpdateButton } from "@/components/app/project/ProjectEditor/UpdateButton";
import { useProjects } from "@/lib/hooks/useProjects";
import { useActions, useValues } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";
import { Button } from "@/components/ui/button";
import { IconHistory, IconShare } from "@tabler/icons-react";

export function ProjectEditor() {
  const { activeProject } = useProjects();
  const { projectData } = useValues(projectLogic);
  const { updateProjectContent } = useActions(projectLogic);

  useEffect(() => {
    if (projectData?.content) {
      setValue(projectData.content);
      originalValueRef.current = projectData.content;
    }

    console.log("set new data", projectData?.content);
  }, [projectData]);

  const [value, setValue] = useState("");

  const originalValueRef = useRef(value);
  const isDirty = value !== originalValueRef.current;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const update = async () => {
    if (isSubmitting || !isDirty) return;
    setIsSubmitting(true);

    await updateProjectContent(value);

    // todo: fix this shit
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isSubmitting || !isDirty) {
      setIsHovered(false);
    }
  }, [isSubmitting, isDirty]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        if (!isSubmitting && isDirty) {
          update();
        }
      }
    };

    // Use capture phase to catch the event before it reaches the editor
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isSubmitting, isDirty, update]);

  if (!projectData) {
    return null;
  }

  return (
    <div className="w-full p-4 max-w-5xl">
      <motion.div
        className="rounded-2xl border border-border bg-card/60 backdrop-blur"
        initial={{ opacity: 0, x: -50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        transition={{ duration: 1, ease: [0, 1, 0, 1] }}
      >
        <div className="p-4">
          <ProjectHeader
            projectName={activeProject?.name || ""}
            onUpdate={update}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
          <div className="relative rounded-xl overflow-hidden">
            <FileEditor value={value} onChange={(v) => setValue(v)} />
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={"asd"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ ease: "easeInOut", duration: 0.1 }}
                  className="rounded bg-background/80 px-2 py-0.5 text-xs text-muted-foreground shadow-sm"
                >
                  Changed by you 1 week ago
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectHeader({
  projectName,
  onUpdate,
  isSubmitting,
  isDirty,
  isHovered,
  setIsHovered,
}: {
  projectName: string;
  onUpdate: () => void;
  isSubmitting: boolean;
  isDirty: boolean;
  isHovered: boolean;
  setIsHovered: (val: boolean) => void;
}) {
  return (
    <div className="mb-3 relative flex items-center justify-center gap-4">
      <div className="absolute left-0 flex items-center gap-2">
        <div className="relative group">
          <Button variant="ghost" disabled aria-label="Share project">
            <IconShare className="size-5" />
          </Button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="font-medium">Share Project</div>
            <div className="text-xs text-muted-foreground">coming soon</div>
          </div>
        </div>
        <div className="relative group">
          <Button variant="ghost" disabled aria-label="History">
            <IconHistory className="size-5" />
          </Button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="font-medium">Project History</div>
            <div className="text-xs text-muted-foreground">coming soon</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-px w-8 bg-border"></div>
        <h1 className="text-2xl font-semibold tracking-wide text-foreground/90 whitespace-nowrap">
          {projectName}
        </h1>
        <div className="h-px w-8 bg-border"></div>
      </div>
      <div className="absolute right-0">
        <UpdateButton
          onClick={onUpdate}
          isSubmitting={isSubmitting}
          isDirty={isDirty}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
        />
      </div>
    </div>
  );
}
