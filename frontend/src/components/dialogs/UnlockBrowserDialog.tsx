import { useActions, useValues } from "kea";
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

export function UnlockBrowserDialog() {
  const { browserIsUnlocked, shouldSetUpPassphrase } = useValues(keyLogic);
  const { isLoggedIn } = useValues(authLogic);
  const { setPassphrase, decryptPrivateKey } = useActions(keyLogic);

  const [passphrase, setLocalPassphrase] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (browserIsUnlocked) {
      setLocalPassphrase("");
      setSubmitting(false);
    }
  }, [browserIsUnlocked]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!passphrase || submitting) return;
    try {
      setSubmitting(true);
      setPassphrase(passphrase);
      await decryptPrivateKey();
      // When successful, browserIsUnlocked becomes true and dialog closes.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!browserIsUnlocked && isLoggedIn && !shouldSetUpPassphrase}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
        className="sm:max-w-md"
      >
        <form onSubmit={onSubmit} className="grid gap-4">
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
              onChange={(e) => setLocalPassphrase(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              autoFocus
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={!passphrase || submitting}>
              {submitting ? "Unlocking…" : "Unlock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
