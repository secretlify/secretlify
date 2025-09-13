import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/app/project/$projectId")({
  component: ProjectEditor,
});

function ProjectEditor() {
  const { projectId } = useParams({ from: "/app/project/$projectId" });
  const [value, setValue] = useState("");

  const onSubmit = () => {
    // Placeholder submit action
    // eslint-disable-next-line no-alert
    alert(
      `Submitted content for project ${projectId}:\n\n${value.substring(
        0,
        200
      )}${value.length > 200 ? "..." : ""}`
    );
  };

  return (
    <div className="w-full p-2 md:p-4">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Project <span className="text-primary">{projectId}</span>
            </h1>
            <p className="text-muted-foreground">
              Edit your secret content below.
            </p>
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
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type or paste your content here..."
              className={cn(
                "w-full min-h-[40vh] md:min-h-[55vh] resize-vertical",
                "rounded-xl bg-background/60 text-foreground",
                "outline-none border border-transparent focus:border-ring",
                "p-4 md:p-5 leading-relaxed text-base md:text-lg",
                "placeholder:text-muted-foreground/70"
              )}
            />
          </div>
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="flex items-center justify-end">
              <Button
                size="lg"
                className={cn(
                  "h-12 px-8 rounded-xl",
                  "bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600",
                  "hover:from-blue-500 hover:via-fuchsia-500 hover:to-pink-500",
                  "text-white shadow-lg shadow-fuchsia-600/20"
                )}
                onClick={onSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
