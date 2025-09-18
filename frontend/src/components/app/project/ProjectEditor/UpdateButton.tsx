import { cn } from "@/lib/utils";
import { CommandIcon } from "lucide-react";
import { motion } from "motion/react";

export function UpdateButton({
  onClick,
  isSubmitting,
  isDirty,
  isHovered,
  setIsHovered,
}: {
  onClick: () => void;
  isSubmitting: boolean;
  isDirty: boolean;
  isHovered: boolean;
  setIsHovered: (val: boolean) => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label="Update"
      onClick={onClick}
      disabled={isSubmitting || !isDirty}
      whileTap={isSubmitting || !isDirty ? undefined : { scale: 0.95 }}
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
        if (!isSubmitting && isDirty) setIsHovered(true);
      }}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md border px-4 font-semibold whitespace-nowrap cursor-pointer",
        "bg-primary text-primary-foreground",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {isSubmitting ? (
        <>
          <span
            aria-label="Saving"
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/60 border-t-transparent"
          />
          <span>Saving...</span>
        </>
      ) : !isDirty ? (
        <span>Saved</span>
      ) : (
        <>
          <span>Update {"("}</span>
          <span>
            <CommandIcon />
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
    </motion.button>
  );
}
