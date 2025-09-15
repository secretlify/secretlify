// removed unused Button import
import { cn } from "@/lib/utils";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/app/project/$projectId")({
  component: ProjectEditor,
});

function ProjectEditor() {
  const { projectId } = useParams({ from: "/app/project/$projectId" });
  const [value, setValue] = useState(
    'BANK_PASSWORD="iliketurtles"\nDATABASE_PASSWORD="zaq12wsx"'
  );

  const originalValueRef = useRef(value);
  const isDirty = value !== originalValueRef.current;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lastChangedLabel, setLastChangedLabel] = useState(
    "Changed by you 1 week ago"
  );

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.languages.register({ id: "dotenv" });

      monaco.languages.setMonarchTokensProvider("dotenv", {
        tokenizer: {
          root: [
            [/^[A-Z0-9_]+(?==)/, "variable"],
            [/"([^"\\]|\\.)*"/, "string"],
            [/#.*/, "comment"],
          ],
        },
      });

      monaco.editor.defineTheme("dotenvTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "variable", foreground: "D4AF37" },
          { token: "string", foreground: "A3A3A3" },
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        ],
        colors: {
          focusBorder: "#00000000",
        },
      });
    });
  }, []);

  const onSubmit = () => {
    if (isSubmitting || !isDirty) return;
    setIsSubmitting(true);
    setTimeout(() => {
      originalValueRef.current = value;
      setIsSubmitting(false);
      setLastChangedLabel("Changed by you just now");
    }, 1000);
  };

  // Reset hover state when button becomes disabled
  useEffect(() => {
    if (isSubmitting || !isDirty) {
      setIsHovered(false);
    }
  }, [isSubmitting, isDirty]);

  return (
    <div className="w-full p-2 md:p-4">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <motion.div
          className={cn(
            "rounded-2xl border border-border bg-card/60 backdrop-blur",
            "shadow-[0_10px_40px_-15px_rgba(0,0,0,0.35)]",
            "hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.45)]"
          )}
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: [0, 1, 0, 1], delay: 0.1 }}
        >
          <div className="p-5 ">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h1 className="text-3xl md:text-3xl font-bold tracking-tight">
                Project {projectId}
              </h1>
              <motion.button
                type="button"
                aria-label="Update"
                onClick={onSubmit}
                disabled={isSubmitting || !isDirty}
                whileTap={
                  isSubmitting || !isDirty ? undefined : { scale: 0.95 }
                }
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
                    <span>Update</span>
                    <motion.span
                      className="inline-flex items-center justify-center overflow-hidden"
                      aria-hidden
                      initial={{ width: 0 }}
                      animate={{ width: isHovered ? 16 : 0 }}
                      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                    >
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{
                          opacity: isHovered ? 1 : 0,
                          x: isHovered ? 0 : -8,
                        }}
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
            </div>
            <div className={cn("relative rounded-xl overflow-hidden border")}>
              <Editor
                height="55vh"
                language="dotenv"
                theme="dotenvTheme"
                value={value}
                onChange={(v) => setValue(v ?? "")}
                options={{
                  minimap: { enabled: false },
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  fontSize: 14,
                  automaticLayout: true,
                  // Disable right-side navigation/overview UI and highlights
                  overviewRulerBorder: false,
                  hideCursorInOverviewRuler: true,
                  renderLineHighlight: "none",
                }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lastChangedLabel}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ ease: "easeInOut", duration: 0.1 }}
                    className="rounded bg-background/80 px-2 py-0.5 text-xs text-muted-foreground shadow-sm"
                  >
                    {lastChangedLabel}
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
