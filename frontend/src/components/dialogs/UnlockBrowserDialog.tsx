import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authLogic } from "@/lib/logics/authLogic";
import { keyLogic } from "@/lib/logics/keyLogic";
import {
  IconExclamationCircle,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useAsyncActions, useValues } from "kea";
import { useEffect, useState } from "react";

export function UnlockBrowserDialog() {
  const { browserIsUnlocked, shouldSetUpPassphrase } = useValues(keyLogic);
  const { isLoggedIn } = useValues(authLogic);
  const { setPassphrase, decryptPrivateKey } = useAsyncActions(keyLogic);

  const [passphrase, setLocalPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (browserIsUnlocked) {
      setLocalPassphrase("");
      setSubmitting(false);
      setIsError(false);
    }
  }, [browserIsUnlocked]);

  const handleUnlock = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!passphrase || submitting) return;
    setIsError(false);
    try {
      setPassphrase(passphrase);
      await decryptPrivateKey();
    } catch (e) {
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!browserIsUnlocked && isLoggedIn && !shouldSetUpPassphrase}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock this browser</DialogTitle>
          <DialogDescription>
            Enter your passphrase to decrypt your private key locally.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <label htmlFor="unlock-pass" className="text-sm font-medium">
            Passphrase
          </label>
          <div className="relative">
            <input
              id="unlock-pass"
              type={showPassphrase ? "text" : "password"}
              value={passphrase}
              onChange={(e) => {
                setLocalPassphrase(e.target.value);
                if (isError) {
                  setIsError(false);
                }
              }}
              className="w-full rounded-md border px-3 py-2 text bg-background text-base sm:text-sm pr-10"
              autoFocus
              autoComplete="current-password"
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
          {isError && (
            <div className="flex items-center gap-2 p-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              <IconExclamationCircle />
              <span>Incorrect passphrase</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            onClick={handleUnlock}
            disabled={!passphrase || submitting}
            isLoading={submitting}
          >
            Unlock
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
