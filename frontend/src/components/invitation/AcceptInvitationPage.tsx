import { authLogic } from "@/lib/logics/authLogic";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useActions, useAsyncActions, useValues } from "kea";
import { useState } from "react";
import {
  IconKey,
  IconUsers,
  IconArrowRight,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { acceptInvitationLogic } from "@/lib/logics/acceptInvitationLogic";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { commonLogic } from "@/lib/logics/commonLogic";

export function AcceptInvitationPage() {
  const navigate = useNavigate();
  const { inviteId } = useParams({ from: "/invite/$inviteId" });
  const { isLoggedIn, userData } = useValues(authLogic);
  const [passphrase, setPassphrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { invitation } = useValues(acceptInvitationLogic);
  const { acceptInvitation } = useAsyncActions(acceptInvitationLogic);
  const { loadProjects } = useAsyncActions(projectsLogic);
  const { setInviteIdToShowAfterLogin } = useActions(commonLogic);

  const handleAcceptInvitation = async () => {
    setIsError(false);
    await setIsLoading(true);

    try {
      await acceptInvitation(passphrase);
      await loadProjects();
      navigate({
        to: "/app/project/$projectId",
        params: { projectId: invitation?.projectId! },
      });
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md">
          <div className="bg-card border rounded-xl p-6 text-center">
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
              className="inline-flex items-center justify-center w-full gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() => setInviteIdToShowAfterLogin(inviteId)}
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
        <div className="bg-card border rounded-xl p-6">
          <div className="text-center mb-6">
            <IconUsers className="size-8 mx-auto text-primary mb-3" />
            <h1 className="text-xl font-bold mb-2">Join Project</h1>
            <p className="text-muted-foreground text-sm">
              Enter the passphrase to accept the invitation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg border">
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
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary text-base sm:text-sm"
                placeholder="Enter passphrase"
                autoComplete="new-password"
                autoFocus
              />
              {isError && (
                <div className="flex items-center gap-2 p-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                  <IconExclamationCircle />
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
