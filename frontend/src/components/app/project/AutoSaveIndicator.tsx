import { projectLogic } from "@/lib/logics/projectLogic";
import { cn } from "@/lib/utils";
import { useActions, useValues } from "kea";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";

const AUTOSAVE_DELAY = 100; // 100ms

export function AutoSaveIndicator() {
  const { isSubmitting, isEditorDirty, inputValue } = useValues(projectLogic);
  const { updateProjectContent } = useActions(projectLogic);
  const { isExternallyUpdated } = useValues(projectLogic);

  const [saveState, setSaveState] = useState<"saving" | "saved">("saved");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simple autosave: when user stops typing, save after delay
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isEditorDirty && !isExternallyUpdated) {
      timeoutRef.current = setTimeout(() => {
        setSaveState("saving");
        posthog.capture("autosave_triggered");
        updateProjectContent();
      }, AUTOSAVE_DELAY);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, isEditorDirty, isExternallyUpdated, updateProjectContent]);

  // Simple state management: saving -> wait -> saved
  useEffect(() => {
    if (saveState === "saving" && !isSubmitting) {
      // Wait a bit before showing "saved" to ensure user sees "saving"
      setTimeout(() => {
        setSaveState("saved");
      }, 1000);
    }
  }, [saveState, isSubmitting]);

  // Reset to saved when content is clean
  useEffect(() => {
    if (!isEditorDirty) {
      setSaveState("saved");
    }
  }, [isEditorDirty]);

  return (
    <div className="relative h-10 flex items-center px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={saveState}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{
            duration: 0.1,
            ease: [0.2, 0, 0, 1],
          }}
          className={cn(
            "inline-flex h-10 items-center gap-2 font-medium whitespace-nowrap text-sm",
            saveState === "saving" && "text-blue-600 dark:text-blue-400",
            saveState === "saved" && "text-green-600 dark:text-green-600"
          )}
        >
          {saveState === "saving" && (
            <>
              <span
                aria-label="Saving"
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/60 border-t-transparent"
              />
              <span>Saving...</span>
            </>
          )}
          {saveState === "saved" && (
            <>
              <Check className="h-4 w-4" />
              <span>Saved</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
