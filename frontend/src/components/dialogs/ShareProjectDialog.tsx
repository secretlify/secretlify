import { useValues, useActions, useAsyncActions } from "kea";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { projectLogic } from "@/lib/logics/projectLogic";
import { invitationsLogic } from "@/lib/logics/invitationsLogic";
import type { Invitation } from "@/lib/api/invitations.api";
import { IconUsers, IconCopy, IconCheck, IconTrash } from "@tabler/icons-react";

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

function MembersSection() {
  const { projectData, userData } = useValues(projectLogic);

  if (!projectData) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <IconUsers className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Members</h3>
      </div>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {projectData.members.map((memberId) => (
          <div
            key={memberId}
            className="flex items-center gap-3 p-2 rounded-md bg-muted/30"
          >
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
              {memberId.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {memberId === userData?.id
                  ? "You"
                  : `User ${memberId.slice(-4)}`}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {memberId === userData?.id
                  ? userData.email
                  : `Member ID: ${memberId}`}
              </div>
            </div>
            {memberId === userData?.id && (
              <div className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                Owner
              </div>
            )}
          </div>
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
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleRevokeLink = async (invitationId: string) => {
    setIsLoading(true);
    await deleteInvitation(invitationId);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground/90 mb-1">
          Invitation link
        </div>
        <div className="text-xs text-muted-foreground">
          Created • ID: {invitation.id.slice(-8)}
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
              `${window.location.origin}/invite/${invitation.id}`
            )
          }
          className="size-8 p-0"
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
          className="size-8 p-0 text-destructive hover:text-destructive"
          aria-label="Revoke link"
        >
          <IconTrash className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ActiveInviteLinksSection() {
  const { invitations, invitationsLoading } = useValues(invitationsLogic);
  const { loadInvitations } = useActions(invitationsLogic);

  useEffect(() => {
    loadInvitations();
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Active invite links</h3>
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
  const { invitationsLoading } = useValues(invitationsLogic);
  const { createInvitation } = useActions(invitationsLogic);
  const [passphrase, setPassphrase] = useState("");

  const handleGenerateLink = async () => {
    try {
      await createInvitation(passphrase);
      setPassphrase("");
    } catch (error) {
      console.error("Failed to create invitation:", error);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Generate new invite link</h3>
      <div className="grid gap-2">
        <input
          id="passphrase"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          placeholder="Enter a secure passphrase"
          autoComplete="new-password"
          required
        />
        <div className="text-xs text-muted-foreground">
          This passphrase will be required to accept the invitation. Each invite
          link can only be used by one person.
        </div>
      </div>

      <Button
        onClick={handleGenerateLink}
        disabled={!passphrase.trim() || invitationsLoading}
        className="w-full"
      >
        {invitationsLoading ? "Generating..." : "Generate invite link"}
      </Button>
    </div>
  );
}

export function ShareProjectDialog({
  open,
  onOpenChange,
}: ShareProjectDialogProps) {
  const { projectData } = useValues(projectLogic);
  const { invitationsLoading } = useValues(invitationsLogic);

  if (!projectData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
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

export default ShareProjectDialog;
