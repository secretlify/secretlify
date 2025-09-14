// removed unused Button import
import { cn } from "@/lib/utils";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { AnimatePresence, motion } from "motion/react";

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
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      originalValueRef.current = value;
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="w-full p-2 md:p-4">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Project {projectId}
            </h1>
          </div>
        </div>

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
          <div className="p-4 md:p-6">
            <div className={cn("rounded-xl overflow-hidden border")}>
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
              <UpdateButton
                visible={isDirty}
                isSubmitting={isSubmitting}
                onClick={onSubmit}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

type UpdateButtonProps = {
  visible: boolean;
  isSubmitting: boolean;
  onClick: () => void;
};

function UpdateButton({ visible, isSubmitting, onClick }: UpdateButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="update-button"
          className="absolute bottom-3 right-3 z-10 inline-block cursor-pointer"
          layout
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.5,
          }}
          whileHover={isSubmitting ? undefined : { scale: 1.05 }}
          whileTap={isSubmitting ? undefined : { scale: 0.95 }}
          onClick={onClick}
        >
          <BackgroundGradient
            className={cn(
              "rounded-[22px] bg-white dark:bg-zinc-900",
              isSubmitting ? "p-3 px-6" : "p-4 px-8"
            )}
          >
            {isSubmitting ? (
              <span
                aria-label="Saving"
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"
              />
            ) : (
              <p className="font-semibold">Update</p>
            )}
          </BackgroundGradient>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
