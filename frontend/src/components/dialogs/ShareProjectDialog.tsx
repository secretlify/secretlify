import { useValues } from "kea";
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
import { IconUsers, IconCopy, IconCheck, IconTrash } from "@tabler/icons-react";

interface InviteLink {
  id: string;
  link: string;
  passphrase: string;
  createdAt: Date;
}

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ShareProjectDialog({
  open,
  onOpenChange,
}: ShareProjectDialogProps) {
  const { projectData, userData } = useValues(projectLogic);

  const [passphrase, setPassphrase] = useState("");
  const [generating, setGenerating] = useState(false);
  const [activeInviteLinks, setActiveInviteLinks] = useState<InviteLink[]>([]);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPassphrase("");
      setGenerating(false);
      setCopiedLinkId(null);
    }
  }, [open]);

  const handleGenerateLink = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!passphrase.trim() || generating) return;

    try {
      setGenerating(true);
      // TODO: Implement actual invite link generation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      const newInviteLink: InviteLink = {
        id: Math.random().toString(36).substring(7),
        link: `${window.location.origin}/invite/${Math.random()
          .toString(36)
          .substring(7)}`,
        passphrase: passphrase,
        createdAt: new Date(),
      };

      setActiveInviteLinks((prev) => [newInviteLink, ...prev]);
      setPassphrase(""); // Clear the passphrase input
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = async (linkId: string, link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleRevokeLink = (linkId: string) => {
    setActiveInviteLinks((prev) => prev.filter((link) => link.id !== linkId));
  };

  if (!projectData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={!generating}
        className="sm:max-w-lg"
      >
        <div className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Invite others to collaborate on "{projectData.name}".
            </DialogDescription>
          </DialogHeader>

          {/* Members Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconUsers className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Members</h3>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {projectData.members.length > 0 ? (
                projectData.members.map((memberId) => (
                  <div
                    key={memberId}
                    className="flex items-center gap-3 p-2 rounded-md bg-muted/30"
                  >
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {/* For now, show member ID initial. TODO: Replace with actual user data */}
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
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  You are the only member of this project
                </div>
              )}
            </div>
          </div>

          {/* Active Invite Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Active invite links</h3>
            {activeInviteLinks.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activeInviteLinks.map((inviteLink) => (
                  <div
                    key={inviteLink.id}
                    className="flex items-center gap-2 p-3 bg-muted/30 rounded-md"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono text-foreground/90 truncate mb-1">
                        {inviteLink.link}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {inviteLink.createdAt.toLocaleString()} •
                        Passphrase: {inviteLink.passphrase}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleCopyLink(inviteLink.id, inviteLink.link)
                        }
                        className="size-8 p-0"
                        aria-label="Copy link"
                      >
                        {copiedLinkId === inviteLink.id ? (
                          <IconCheck className="size-4 text-green-600" />
                        ) : (
                          <IconCopy className="size-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRevokeLink(inviteLink.id)}
                        className="size-8 p-0 text-destructive hover:text-destructive"
                        aria-label="Revoke link"
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <div className="text-sm text-muted-foreground mb-2">
                  No invite links created yet
                </div>
                <div className="text-xs text-muted-foreground">
                  Generate your first invite link below to start collaborating
                </div>
              </div>
            )}
          </div>

          {/* Invite Link Generation */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Generate new invite link</h3>
            <form onSubmit={handleGenerateLink} className="space-y-3">
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
                  This passphrase will be required to accept the invitation.
                  Each invite link can only be used by one person.
                </div>
              </div>

              <Button
                type="submit"
                disabled={!passphrase.trim() || generating}
                className="w-full"
              >
                {generating ? "Generating..." : "Generate invite link"}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareProjectDialog;
