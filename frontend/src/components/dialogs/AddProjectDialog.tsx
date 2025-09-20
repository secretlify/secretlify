import { useActions } from "kea";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import posthog from "posthog-js";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddProjectDialog({
  open,
  onOpenChange,
}: AddProjectDialogProps) {
  const { loadProjects, addProject } = useActions(projectsLogic);

  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setSubmitting(false);
    }
  }, [open]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!name || submitting) return;
    try {
      setSubmitting(true);
      await addProject({
        name: name,
      });
      await loadProjects();
      onOpenChange?.(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={!submitting}
        className="sm:max-w-md"
      >
        <form onSubmit={onSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Add a new project</DialogTitle>
            <DialogDescription>
              Name your project. You can change it later.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <label htmlFor="project-name" className="text-sm font-medium">
              Project name
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={!name.trim() || submitting}>
              {submitting ? "Creating…" : "Create project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProjectDialog;
