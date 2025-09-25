import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectMemberRole } from "@/lib/api/projects.api";
import { authLogic } from "@/lib/logics/authLogic";
import { projectLogic } from "@/lib/logics/projectLogic";
import { projectSettingsLogic } from "@/lib/logics/projectSettingsLogic";
import { IconEdit, IconTrash, IconUserMinus } from "@tabler/icons-react";
import { useActions, useAsyncActions, useValues } from "kea";
import { useEffect, useMemo, useState } from "react";

interface ProjectSettingsDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

function RenameProjectSection() {
  const { projectData, currentUserRole } = useValues(projectLogic);
  const { jwtToken } = useValues(authLogic);
  const { updateProjectLoading } = useValues(projectSettingsLogic);

  const { updateProject } = useAsyncActions(projectSettingsLogic);

  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [showRenameForm, setShowRenameForm] = useState(false);

  const canRename = currentUserRole === ProjectMemberRole.Owner;

  useEffect(() => {
    if (showRenameForm && projectData) {
      setNewName(projectData.name);
    }
  }, [showRenameForm, projectData]);

  const handleRename = async () => {
    if (!projectData || !jwtToken || !newName.trim() || isRenaming) return;

    try {
      setIsRenaming(true);
      await updateProject({ projectId: projectData.id, name: newName.trim() });
      setShowRenameForm(false);
    } finally {
      setIsRenaming(false);
    }
  };

  if (!canRename) {
    return (
      <div className="space-y-3 overflow-hidden">
        <div className="flex items-center gap-2">
          <IconEdit className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Rename project</h3>
        </div>
        <div className="text-center py-6 px-4 bg-muted/20 rounded-md border border-dashed">
          <div className="text-sm text-muted-foreground">
            You are a <span className="font-medium underline">Member</span> of
            this project.
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Only <span className="font-medium underline">Owners</span> can
            rename projects.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-hidden">
      <div className="flex items-center gap-2">
        <IconEdit className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Rename project</h3>
      </div>

      {showRenameForm ? (
        <div className="flex gap-2">
          <input
            id="project-name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2 bg-background text-base sm:text-sm"
            autoFocus
            required
          />
          <Button
            onClick={handleRename}
            isLoading={updateProjectLoading}
            disabled={
              !newName.trim() ||
              newName.trim() === projectData?.name ||
              isRenaming
            }
            className="cursor-pointer"
          >
            {isRenaming ? "Renaming…" : "Save"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowRenameForm(false)}
            disabled={isRenaming}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground/90 truncate">
              {projectData?.name}
            </div>
            <div className="text-xs text-muted-foreground">
              Current project name
            </div>
          </div>
          <Button
            onClick={() => setShowRenameForm(true)}
            variant="ghost"
            size="sm"
            className="cursor-pointer"
          >
            <IconEdit className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function DangerZoneSection() {
  const { deleteProjectLoading } = useValues(projectSettingsLogic);

  const { projectData } = useValues(projectLogic);
  const { userData } = useValues(authLogic);
  const { deleteProject, removeMember } = useActions(projectSettingsLogic);
  const [isLoading, setIsLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const myRole = useMemo(
    () =>
      projectData?.members.find((member) => member.id === userData?.id)?.role,
    [projectData?.members, userData?.id]
  );

  const isOwner = myRole === ProjectMemberRole.Owner;

  const handleDeleteProject = async () => {
    await deleteProject();
  };

  const handleLeaveProject = async () => {
    setIsLoading(true);
    await removeMember({
      projectId: projectData?.id!,
      memberId: userData?.id!,
    });
  };

  const actionText = isOwner ? "Delete project" : "Leave project";
  const actionIcon = isOwner ? IconTrash : IconUserMinus;
  const ActionIcon = actionIcon;

  return (
    <div className="space-y-3 overflow-hidden">
      <div className="flex items-center gap-2">
        <ActionIcon className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Danger zone</h3>
      </div>

      {showDeleteConfirm ? (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="text-sm font-medium text-destructive mb-3">
            {isOwner
              ? "Are you sure you want to delete this project?"
              : "Are you sure you want to leave this project?"}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {isOwner
              ? "This action cannot be undone. This will permanently delete the project and remove all members' access."
              : "You will lose access to this project and its secrets. You'll need a new invitation to rejoin."}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={isOwner ? handleDeleteProject : handleLeaveProject}
              isLoading={deleteProjectLoading || isLoading}
              variant="destructive"
              className="cursor-pointer"
            >
              {isOwner ? "Delete project" : "Leave project"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteProjectLoading || isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground/90">
              {actionText}
            </div>
            <div className="text-xs text-muted-foreground">
              {isOwner
                ? "Permanently delete this project for all members"
                : "Remove yourself from this project"}
            </div>
          </div>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="ghost"
            size="sm"
            className="cursor-pointer text-destructive hover:text-destructive"
          >
            <ActionIcon className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProjectSettingsDialog({
  open,
  onOpenChange,
}: ProjectSettingsDialogProps) {
  const { projectData } = useValues(projectLogic);

  if (!projectData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <div className="grid gap-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Project settings
            </DialogTitle>
            <DialogDescription>
              Manage settings for "{projectData.name}".
            </DialogDescription>
          </DialogHeader>

          <RenameProjectSection />
          <DangerZoneSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectSettingsDialog;
