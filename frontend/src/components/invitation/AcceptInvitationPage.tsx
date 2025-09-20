import { authLogic } from "@/lib/logics/authLogic";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { useAsyncActions, useValues } from "kea";
import { useState } from "react";
import { IconKey, IconUsers, IconArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { acceptInvitationLogic } from "@/lib/logics/acceptInvitationLogic";

export function AcceptInvitationPage() {
  const { inviteId } = useParams({ from: "/invite/$inviteId" });
  const { isLoggedIn, userData } = useValues(authLogic);
  const [passphrase, setPassphrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { acceptInvitation } = useAsyncActions(acceptInvitationLogic);

  const handleAcceptInvitation = async () => {
    setIsError(false);
    await setIsLoading(true);

    try {
      await acceptInvitation(passphrase);
    } catch (e) {
      setIsError(true);
    } finally {
      await setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md">
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="mb-4">
              <IconUsers className="size-8 mx-auto text-muted-foreground" />
            </div>

            <h1 className="text-xl font-bold mb-3">Project Invitation</h1>

            <p className="text-muted-foreground mb-4">
              You've been invited to collaborate on a project! Please log in to
              accept this invitation.
            </p>

            <Link
              to="/app/login"
              className="inline-flex items-center justify-center w-full gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign In to Continue
              <IconArrowRight className="size-4" />
            </Link>

            <p className="text-xs text-muted-foreground mt-3">
              Don't have an account? Signing in will create one for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border rounded-lg p-6">
          <div className="text-center mb-6">
            <IconUsers className="size-8 mx-auto text-primary mb-3" />
            <h1 className="text-xl font-bold mb-2">Join Project</h1>
            <p className="text-muted-foreground text-sm">
              Enter the passphrase to accept the invitation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-muted/50 rounded border">
              <div className="flex items-center gap-3">
                <img
                  src={userData?.avatarUrl}
                  alt="Your avatar"
                  className="size-6 rounded-full"
                />
                <div>
                  <div className="text-sm font-medium">Joining as</div>
                  <div className="text-sm text-muted-foreground">
                    {userData?.email}
                  </div>
                </div>
              </div>
            </div>

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
                onChange={(e) => {
                  setPassphrase(e.target.value);
                  if (isError) {
                    setIsError(false);
                  }
                }}
                className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter passphrase"
                autoComplete="new-password"
                autoFocus
              />
              {isError && (
                <div className="flex items-center gap-2 p-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded">
                  <svg
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zM9.25 14a.75.75 0 001.5 0v.01a.75.75 0 00-1.5 0V14z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Incorrect passphrase. Please try again.</span>
                </div>
              )}
            </div>

            <Button
              isLoading={isLoading}
              onClick={handleAcceptInvitation}
              disabled={!passphrase.trim()}
              className="w-full"
            >
              Accept Invitation
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Invitation ID: {inviteId.slice(-8)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
