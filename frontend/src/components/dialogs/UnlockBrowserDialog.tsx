import { useAsyncActions, useValues } from "kea";
import { useEffect, useState } from "react";
import { keyLogic } from "@/lib/logics/keyLogic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authLogic } from "@/lib/logics/authLogic";
import { IconExclamationCircle } from "@tabler/icons-react";

export function UnlockBrowserDialog() {
  const { browserIsUnlocked, shouldSetUpPassphrase } = useValues(keyLogic);
  const { isLoggedIn } = useValues(authLogic);
  const { setPassphrase, decryptPrivateKey } = useAsyncActions(keyLogic);

  const [passphrase, setLocalPassphrase] = useState("");
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
          <input
            id="unlock-pass"
            type="password"
            value={passphrase}
            onChange={(e) => {
              setLocalPassphrase(e.target.value);
              if (isError) {
                setIsError(false);
              }
            }}
            className="w-full rounded-md border px-3 py-2 text bg-background text-base sm:text-sm"
            autoFocus
            autoComplete="current-password"
            required
          />
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
