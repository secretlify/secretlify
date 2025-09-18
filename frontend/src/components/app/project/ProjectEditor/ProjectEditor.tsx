import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FileEditor } from "@/components/app/project/ProjectEditor/FileEditor";
import { UpdateButton } from "@/components/app/project/ProjectEditor/UpdateButton";
import { useProjects } from "@/lib/hooks/useProjects";
import { useActions, useValues } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";

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
          <div className="mb-3 relative flex items-center justify-center gap-4">
            <div className="absolute left-0 flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-border"></div>
              <h1 className="text-2xl font-semibold tracking-wide text-foreground/90 whitespace-nowrap">
                {activeProject?.name}
              </h1>
              <div className="h-px w-8 bg-border"></div>
            </div>
            <div className="absolute right-0">
              <UpdateButton
                onClick={update}
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isHovered={isHovered}
                setIsHovered={setIsHovered}
              />
            </div>
          </div>
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
