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
          { token: "variable", foreground: "4FC1FF" },
          { token: "string", foreground: "CE9178" },
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        ],
        colors: {},
      });
    });
  }, []);

  const onSubmit = () => {
    alert(
      `Submitted content for project ${projectId}:\n\n${value.substring(
        0,
        200
      )}${value.length > 200 ? "..." : ""}`
    );
    originalValueRef.current = value;
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

        <div
          className={cn(
            "rounded-2xl border border-border bg-card/60 backdrop-blur",
            "shadow-[0_10px_40px_-15px_rgba(0,0,0,0.35)]",
            "transition hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.45)]"
          )}
        >
          <div className="p-4 md:p-6">
            <div
              className={cn(
                "relative bg-background/60 text-foreground",
                "border border-transparent focus-within:border-ring"
              )}
            >
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
                }}
              />
              <AnimatePresence>
                {isDirty && (
                  <motion.div
                    key="update-button"
                    className="absolute bottom-3 right-3 z-10 inline-block cursor-pointer"
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 0.5,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSubmit}
                  >
                    <BackgroundGradient className="rounded-[22px] p-4 px-8 bg-white dark:bg-zinc-900">
                      <p className="font-semibold">Update</p>
                    </BackgroundGradient>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
