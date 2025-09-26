import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Invitation } from "@/lib/api/invitations.api";
import { ProjectMemberRole, type ProjectMember } from "@/lib/api/projects.api";
import { authLogic } from "@/lib/logics/authLogic";
import { invitationsLogic } from "@/lib/logics/invitationsLogic";
import { projectTileLogic } from "@/lib/logics/projectLogic";
import { projectSettingsLogic } from "@/lib/logics/projectSettingsLogic";
import { getRelativeTime } from "@/lib/utils";
import {
  IconCheck,
  IconCopy,
  IconEye,
  IconEyeOff,
  IconHexagonalPrism,
  IconLink,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { useActions, useAsyncActions, useValues } from "kea";
import { useEffect, useMemo, useState } from "react";

interface ProjectAccessDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

function MemberItem({
  member,
  projectId,
}: {
  member: ProjectMember;
  projectId: string;
}) {
  const { updateMemberRoleLoading } = useValues(projectSettingsLogic);
  const { updateMemberRole, removeMember } =
    useAsyncActions(projectSettingsLogic);

  const [deleteIsLoading, setDeleteIsLoading] = useState(false);

  const { userData } = useValues(authLogic);

  const { currentUserRole } = useValues(projectTileLogic);

  const canEditRole = useMemo(() => {
    // Can't edit your own role
    if (member.id === userData?.id) return false;

    // Can't edit owner roles
    if (member.role === ProjectMemberRole.Owner) return false;

    // Only owners can edit admin roles
    if (
      member.role === ProjectMemberRole.Admin &&
      currentUserRole !== ProjectMemberRole.Owner
    )
      return false;

    // Only owners and admins can edit member roles
    if (currentUserRole === ProjectMemberRole.Member) return false;

    return true;
  }, [member.id, member.role, userData?.id, currentUserRole]);

  const canRemove = useMemo(() => {
    // Can't remove yourself
    if (member.id === userData?.id) return false;

    // Can't remove owner
    if (member.role === ProjectMemberRole.Owner) return false;

    // Only owners and admins can remove members
    if (
      currentUserRole !== ProjectMemberRole.Owner &&
      currentUserRole !== ProjectMemberRole.Admin
    )
      return false;

    // Admins can only remove members, not other admins
    if (
      currentUserRole === ProjectMemberRole.Admin &&
      member.role === ProjectMemberRole.Admin
    )
      return false;

    return true;
  }, [member.id, member.role, userData?.id, currentUserRole]);

  const availableRoles = useMemo(() => {
    const roles = [];

    if (currentUserRole === ProjectMemberRole.Owner) {
      roles.push({ value: ProjectMemberRole.Admin, label: "Admin" });
    }

    roles.push({ value: ProjectMemberRole.Member, label: "Member" });

    return roles;
  }, [currentUserRole]);

  const handleRoleChange = async (newRole: ProjectMemberRole) => {
    if (newRole === member.role) return;

    await updateMemberRole({
      projectId,
      memberId: member.id,
      role: newRole,
    });
  };

  const handleRemove = async () => {
    setDeleteIsLoading(true);
    await removeMember({
      projectId,
      memberId: member.id,
    });
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium overflow-hidden">
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt={member.email}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          member.email.charAt(0).toUpperCase()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {member.id === userData?.id ? "You" : "Other member"}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {member.email}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {canEditRole ? (
          <Select
            value={member.role}
            onValueChange={(value: ProjectMemberRole) =>
              handleRoleChange(value)
            }
            disabled={updateMemberRoleLoading}
          >
            <SelectTrigger className="w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-xs px-2 py-1 rounded capitalize bg-muted text-muted-foreground">
            {member.role}
          </div>
        )}
        {canRemove && (
          <Button
            isLoading={deleteIsLoading}
            onClick={handleRemove}
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-destructive hover:text-destructive cursor-pointer"
            aria-label={`Remove ${member.email} from project`}
          >
            <IconTrash className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function MembersSection() {
  const { projectData } = useValues(projectTileLogic);

  if (!projectData) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <IconUsers className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Members</h3>
      </div>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {projectData.members.map((member) => (
          <MemberItem
            key={member.id}
            member={member}
            projectId={projectData.id}
          />
        ))}
      </div>
    </div>
  );
}

function ActiveInviteLinkItem({ invitation }: { invitation: Invitation }) {
  const { deleteInvitation } = useAsyncActions(invitationsLogic);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyLink = async (linkId: string, link: string) => {
    await navigator.clipboard.writeText(link);
    setCopiedLinkId(linkId);
    setTimeout(() => setCopiedLinkId(null), 1_000);
  };

  const handleRevokeLink = async (invitationId: string) => {
    setIsLoading(true);
    await deleteInvitation(invitationId);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground/90 mb-1">
          Invite link
        </div>
        <div className="text-xs text-muted-foreground">
          Created {getRelativeTime(invitation.createdAt)} • ID:{" "}
          {invitation.id.slice(-8)}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            handleCopyLink(
              invitation.id,
              `${import.meta.env.VITE_APP_URL}/invite/${invitation.id}`
            )
          }
          className="size-8 p-0 cursor-pointer"
          aria-label="Copy link"
        >
          {copiedLinkId === invitation.id ? (
            <IconCheck className="size-4 text-green-600" />
          ) : (
            <IconCopy className="size-4" />
          )}
        </Button>
        <Button
          isLoading={isLoading}
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => handleRevokeLink(invitation.id)}
          disabled={isLoading}
          className="size-8 p-0 text-destructive hover:text-destructive cursor-pointer"
          aria-label="Revoke link"
        >
          <IconTrash className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ActiveInviteLinksSection() {
  const { projectData, userData } = useValues(projectTileLogic);
  const { invitations, invitationsLoading } = useValues(invitationsLogic);
  const { loadInvitations } = useActions(invitationsLogic);

  const myRole = useMemo(
    () =>
      projectData?.members.find((member) => member.id === userData?.id)?.role,
    [projectData?.members, userData?.id]
  );

  useEffect(() => {
    if (
      myRole === ProjectMemberRole.Owner ||
      myRole === ProjectMemberRole.Admin
    ) {
      loadInvitations();
    }
  }, [myRole]);

  if (
    myRole !== ProjectMemberRole.Owner &&
    myRole !== ProjectMemberRole.Admin
  ) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <IconLink className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Active invite links</h3>
        </div>
        <div className="text-center py-6 px-4 bg-muted/20 rounded-md border border-dashed">
          <div className="text-sm text-muted-foreground">
            You are a <span className="font-medium underline">Member</span> of
            this project.
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Only{" "}
            <span className="font-medium underline">Owners and Admins</span> can
            view invite links.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <IconLink className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Active invite links</h3>
      </div>
      {invitationsLoading && !invitations ? (
        <div className="text-center py-8 px-4">
          <div className="text-sm text-muted-foreground">
            Loading invitations...
          </div>
        </div>
      ) : invitations && invitations.length > 0 ? (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {invitations.map((invitation: Invitation) => (
            <ActiveInviteLinkItem key={invitation.id} invitation={invitation} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4">
          <div className="text-sm text-muted-foreground mb-2">
            No invite links created yet
          </div>
        </div>
      )}
    </div>
  );
}

function GenerateNewInviteLinkSection() {
  const { projectData, userData } = useValues(projectTileLogic);
  const { createInvitation } = useAsyncActions(invitationsLogic);
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "member">(
    "member"
  );
  const [isLoading, setIsLoading] = useState(false);

  const myRole = useMemo(
    () =>
      projectData?.members.find((member) => member.id === userData?.id)?.role,
    [projectData?.members, userData?.id]
  );

  const availableRoles = useMemo(() => {
    if (myRole === ProjectMemberRole.Owner) {
      return [
        { value: "member" as const, label: "Member" },
        { value: "admin" as const, label: "Admin" },
      ];
    } else if (myRole === ProjectMemberRole.Admin) {
      return [{ value: "member" as const, label: "Member" }];
    }
    return [];
  }, [myRole]);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    await createInvitation(passphrase, selectedRole);
    setPassphrase("");
    setIsLoading(false);
  };

  if (
    myRole !== ProjectMemberRole.Owner &&
    myRole !== ProjectMemberRole.Admin
  ) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <IconHexagonalPrism className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Generate new invite link</h3>
        </div>
        <div className="text-center py-6 px-4 bg-muted/20 rounded-md border border-dashed">
          <div className="text-sm text-muted-foreground">
            You are a <span className="font-medium underline">Member</span> of
            this project.
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Only{" "}
            <span className="font-medium underline">Owners and Admins</span> can
            generate invite links.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <IconHexagonalPrism className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Generate new invite link</h3>
      </div>
      <div className="grid gap-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="passphrase"
              type={showPassphrase ? "text" : "password"}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-background text-base sm:text-sm pr-10"
              placeholder="Enter a secure passphrase"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label={
                showPassphrase ? "Hide passphrase" : "Show passphrase"
              }
            >
              {showPassphrase ? (
                <IconEyeOff className="size-4" />
              ) : (
                <IconEye className="size-4" />
              )}
            </button>
          </div>
          <Select
            value={selectedRole}
            onValueChange={(value: "admin" | "member") =>
              setSelectedRole(value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground">
          This passphrase will be required to accept the invitation. Each invite
          link can only be used by one person.
        </div>
      </div>

      <Button
        onClick={handleGenerateLink}
        isLoading={isLoading}
        disabled={!passphrase.trim()}
        className="w-full cursor-pointer"
      >
        Generate invite link
      </Button>
    </div>
  );
}

export function ProjectAccessDialog({
  open,
  onOpenChange,
}: ProjectAccessDialogProps) {
  const { projectData } = useValues(projectTileLogic);
  const { invitationsLoading } = useValues(invitationsLogic);

  if (!projectData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!invitationsLoading}
        className="sm:max-w-lg"
      >
        <div className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Project access</DialogTitle>
            <DialogDescription>
              Invite others to collaborate on "{projectData.name}".
            </DialogDescription>
          </DialogHeader>

          <MembersSection />
          <ActiveInviteLinksSection />
          <GenerateNewInviteLinkSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectAccessDialog;
