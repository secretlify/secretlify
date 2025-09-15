import { authLogic } from "@/lib/logics/authLogic";
import { keyLogic } from "@/lib/logics/keyLogic";
import { AppNavigation } from "@/components/navigation/app-navigation";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { BindLogic, useActions, useValues } from "kea";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const RootLayout = () => (
  <BindLogic logic={authLogic} props={{}}>
    <BindLogic logic={keyLogic} props={{}}>
      <RootInner />
      <AppNavigation />
    </BindLogic>
  </BindLogic>
);

function RootInner() {
  const { shouldSetUpPassphrase } = useValues(keyLogic);
  const { setUpPassphrase } = useActions(keyLogic);

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!shouldSetUpPassphrase) {
      setPass1("");
      setPass2("");
      setSubmitting(false);
    }
  }, [shouldSetUpPassphrase]);

  const passwordsMatch = useMemo(
    () => pass1.length > 0 && pass1 === pass2,
    [pass1, pass2]
  );

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!passwordsMatch || submitting) return;
    try {
      setSubmitting(true);
      setUpPassphrase(pass1);
    } catch {}
  };

  return (
    <>
      <Outlet />
      <Dialog open={shouldSetUpPassphrase}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          showCloseButton={false}
          className="sm:max-w-md"
        >
          <form onSubmit={onSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Set up your passphrase</DialogTitle>
              <DialogDescription>
                Create a passphrase to encrypt your private key. Store it
                safely.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <label htmlFor="pp1" className="text-sm font-medium">
                Passphrase
              </label>
              <input
                id="pp1"
                type="password"
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                autoFocus
                autoComplete="new-password"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="pp2" className="text-sm font-medium">
                Confirm passphrase
              </label>
              <input
                id="pp2"
                type="password"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                autoComplete="new-password"
                required
              />
              {pass2.length > 0 && !passwordsMatch && (
                <div className="text-xs text-destructive">
                  Passphrases do not match.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit" disabled={!passwordsMatch || submitting}>
                {submitting ? "Setting up…" : "Set up passphrase"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const Route = createRootRoute({ component: RootLayout });
