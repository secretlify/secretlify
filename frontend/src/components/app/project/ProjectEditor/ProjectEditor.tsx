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

  if (!projectData) {
    return null;
  }

  return (
    <div className="w-full p-2 md:p-4">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <motion.div
          className={cn(
            "rounded-2xl border border-border bg-card/60 backdrop-blur"
          )}
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0, 1, 0, 1] }}
        >
          <div className="p-5 ">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h1 className="text-3xl md:text-3xl font-bold tracking-tight">
                Project {activeProject?.name}
              </h1>
              <UpdateButton
                onClick={update}
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isHovered={isHovered}
                setIsHovered={setIsHovered}
              />
            </div>
            <div className={cn("relative rounded-xl overflow-hidden border")}>
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
    </div>
  );
}
