import { projectLogic } from "@/lib/logics/projectLogic";
import { cn } from "@/lib/utils";
import { useActions, useValues } from "kea";
import { motion } from "motion/react";

export function MobileUpdateButton() {
  const { isSubmitting, isEditorDirty } = useValues(projectLogic);
  const { updateProjectContent } = useActions(projectLogic);

  // Remove hover state for mobile

  return (
    <motion.button
      type="button"
      aria-label="Update"
      onClick={updateProjectContent}
      disabled={isSubmitting || !isEditorDirty}
      whileTap={isSubmitting || !isEditorDirty ? undefined : { scale: 0.95 }}
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
      // Disable hover animations on mobile
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md border px-3 font-medium whitespace-nowrap cursor-pointer text-sm",
        "bg-primary text-primary-foreground",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {isSubmitting ? (
        <>
          <span
            aria-label="Saving"
            className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground/60 border-t-transparent"
          />
          <span className="">Saving...</span>
        </>
      ) : !isEditorDirty ? (
        <>
          <span className="">Saved</span>
        </>
      ) : (
        <span>Save</span>
      )}
    </motion.button>
  );
}
