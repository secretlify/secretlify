import { createFileRoute } from "@tanstack/react-router";
import { BindLogic, useActions, useValues } from "kea";
import { keyLogic } from "@/lib/logics/keyLogic";
import { authLogic } from "@/lib/logics/authLogic";
import { useState, useEffect } from "react";
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
  const { shouldSetUpPassphrase, userData, privateKeyDecrypted, passphrase } =
    useValues(keyLogic);

  const { setUpPassphrase, setPassphrase, decryptPrivateKey } =
    useActions(keyLogic);

  const { setUserData } = useActions(authLogic);

  const [setupPass, setSetupPass] = useState("");

  useEffect(() => {
    if (passphrase && userData?.encryptedPrivateKey) {
      decryptPrivateKey();
    }
  }, [passphrase, userData?.encryptedPrivateKey]);

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
              placeholder="Enter passphrase for setup"
              value={setupPass}
              onChange={(e) => setSetupPass(e.target.value)}
            />
            <Button
              onClick={() => setupPass && setUpPassphrase(setupPass)}
              disabled={!setupPass}
            >
              Set up passphrase and generate keys
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
            Current keys
          </h2>
          <div className="text-xs break-all">
            <div className="font-medium">Public Key:</div>
            <div className="rounded-md bg-muted p-2">
              {userData?.publicKey || "—"}
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

        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wide">
            Decrypt private key (local)
          </h2>
          <input
            type="password"
            className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            placeholder="Enter passphrase to decrypt"
            value={passphrase || ""}
            onChange={(e) => setPassphrase(e.target.value)}
          />
          <div className="text-xs break-all">
            <div className="font-medium">Private Key (decrypted locally):</div>
            <div className="rounded-md bg-muted p-2">
              {privateKeyDecrypted ||
                (passphrase ? "Invalid passphrase or no data" : "—")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
