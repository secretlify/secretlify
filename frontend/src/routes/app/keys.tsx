import { createFileRoute } from "@tanstack/react-router";
import { BindLogic, useActions, useValues } from "kea";
import { keyLogic } from "@/lib/logics/keyLogic";
import { authLogic } from "@/lib/logics/authLogic";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/keys")({
  component: KeysPage,
});

function KeysPage() {
  return (
    <BindLogic logic={authLogic} props={{}}>
      <BindLogic logic={keyLogic} props={{}}>
        <KeysInner />
      </BindLogic>
    </BindLogic>
  );
}

function KeysInner() {
  const { shouldSetUpPassphrase, userData, localKeyPair } = useValues(
    keyLogic as any
  );
  const { setUpPassphrase } = useActions(keyLogic as any);
  const { setUserData } = useActions(authLogic);

  const [passphrase, setPassphrase] = useState("");

  const clearKeys = () => {
    if (!userData) return;
    setUserData({
      ...userData,
      publicKey: undefined,
      encryptedPrivateKey: undefined,
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 rounded-2xl border border-border bg-card/60 backdrop-blur p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Keys setup</h1>
        <div className="text-sm text-muted-foreground">
          Requires set up? {shouldSetUpPassphrase ? "Yes" : "No"}
        </div>

        {shouldSetUpPassphrase && (
          <div className="space-y-3">
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              placeholder="Enter passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
            <Button
              onClick={() => passphrase && setUpPassphrase(passphrase)}
              disabled={!passphrase}
            >
              Set up passphrase
            </Button>
          </div>
        )}

        <div className="pt-2 flex gap-3">
          <Button variant="secondary" onClick={clearKeys}>
            Reset keys in user data
          </Button>
        </div>

        <div className="space-y-3 pt-4">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wide">
            Current keys (local session)
          </h2>
          <div className="text-xs break-all">
            <div className="font-medium">Public Key:</div>
            <div className="rounded-md bg-muted p-2">
              {localKeyPair?.publicKey || "—"}
            </div>
          </div>
          <div className="text-xs break-all">
            <div className="font-medium">Private Key (local only):</div>
            <div className="rounded-md bg-muted p-2">
              {localKeyPair?.privateKey || "—"}
            </div>
          </div>
          <div className="text-xs break-all">
            <div className="font-medium">
              Encrypted Private Key (sent to server):
            </div>
            <div className="rounded-md bg-muted p-2">
              {userData?.encryptedPrivateKey || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
