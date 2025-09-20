import { authLogic } from "@/lib/logics/authLogic";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { useActions, useValues } from "kea";
import { useState } from "react";
import { motion } from "motion/react";
import { IconKey, IconUsers, IconArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { acceptInvitationLogic } from "@/lib/logics/acceptInvitationLogic";

export function AcceptInvitationPage() {
  const { inviteId } = useParams({ from: "/invite/$inviteId" });
  const { isLoggedIn, userData } = useValues(authLogic);
  const [passphrase, setPassphrase] = useState("");

  const { acceptInvitation } = useActions(acceptInvitationLogic);

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0, 1, 0, 1] },
    },
  } as const;

  const handleAcceptInvitation = async () => {
    // TODO: Implement invitation acceptance logic
    acceptInvitation(passphrase);
  };

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-card rounded-xl shadow-lg border border-border p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-muted rounded-full text-muted-foreground">
                <IconUsers className="size-8" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-card-foreground mb-4">
              Project Invitation
            </h1>

            <p className="text-muted-foreground mb-6">
              You've been invited to collaborate on a project! Please log in to
              accept this invitation.
            </p>

            <div className="space-y-3">
              <Link
                to="/app/login"
                className="inline-flex items-center justify-center w-full gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Sign In to Continue
                <IconArrowRight className="size-4" />
              </Link>

              <p className="text-xs text-muted-foreground">
                Don't have an account? Signing in will create one for you.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // If logged in, show invitation acceptance form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <IconUsers className="size-8" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Join Project
            </h1>

            <p className="text-muted-foreground">
              You've been invited to collaborate on a project. Enter the
              passphrase to accept the invitation.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <img
                    src={userData?.avatarUrl}
                    alt="Your avatar"
                    className="size-6 rounded-full"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">Joining as</div>
                  <div className="text-sm text-muted-foreground">
                    {userData?.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label
                  htmlFor="passphrase"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <IconKey className="size-4" />
                  Invitation Passphrase
                </label>
                <input
                  id="passphrase"
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter the passphrase shared with you"
                  autoComplete="new-password"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  This passphrase was provided by the person who invited you.
                </p>
              </div>

              <Button
                onClick={handleAcceptInvitation}
                disabled={!passphrase.trim()}
                className="w-full"
                size="lg"
              >
                Accept Invitation
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Invitation ID: {inviteId.slice(-8)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
