import { projectLogic } from "@/lib/logics/projectLogic";
import { cn } from "@/lib/utils";
import { useActions, useValues } from "kea";
import { CommandIcon } from "lucide-react";
import { motion } from "motion/react";
import posthog from "posthog-js";
import { useState } from "react";

export function UpdateButton() {
  const { isSubmitting, isEditorDirty } = useValues(projectLogic);
  const { updateProjectContent } = useActions(projectLogic);

  const [isHovered, setIsHovered] = useState(false);

  const update = () => {
    posthog.capture("save_button_clicked");
    updateProjectContent();
  };

  return (
    <motion.div
      aria-label="Save"
      onClick={update}
      layout
      transition={{
        layout: { duration: 0.25, ease: [0.2, 0, 0, 1] },
        scale: {
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 0.5,
        },
      }}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      onHoverStart={() => {
        if (!isSubmitting && isEditorDirty) setIsHovered(true);
      }}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("btn btn-primary")}
    >
      {isSubmitting ? (
        <>
          <span
            aria-label="Saving"
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/60 border-t-transparent"
          />
          <span>Saving...</span>
        </>
      ) : !isEditorDirty ? (
        <span>Saved</span>
      ) : (
        <>
          <span>Save {"("}</span>
          <span>
            <CommandIcon className="w-4" />
          </span>
          <span>+ Enter )</span>
          <motion.span
            className="inline-flex items-center justify-center overflow-hidden"
            aria-hidden
            initial={{ width: 0 }}
            animate={{ width: isHovered ? 16 : 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.5,
              }}
            >
              →
            </motion.span>
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
