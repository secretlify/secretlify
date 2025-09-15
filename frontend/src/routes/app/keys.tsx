import { createFileRoute } from "@tanstack/react-router";
import { BindLogic, useActions, useValues } from "kea";
import { keyLogic } from "@/lib/logics/keyLogic";
import { authLogic } from "@/lib/logics/authLogic";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserApi } from "@/lib/api/user.api";

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

  const { loadUserData } = useActions(authLogic);
  const { jwtToken } = useValues(authLogic);

  const [setupPass, setSetupPass] = useState("");

  useEffect(() => {
    if (passphrase && userData?.privateKeyEncrypted) {
      decryptPrivateKey();
    }
  }, [passphrase, userData?.privateKeyEncrypted]);

  const copyToClipboard = async (value?: string | null) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {}
  };

  const areKeysSet = Boolean(
    userData?.publicKey && userData?.privateKeyEncrypted
  );

  const isBrowserUnlocked = Boolean(privateKeyDecrypted);

  const simulateNewAccount = async () => {
    if (!jwtToken) return;
    await UserApi.deleteKeys(jwtToken);
    await loadUserData();
    await decryptPrivateKey();
  };

  const simulateNewBrowser = async () => {
    setPassphrase("");
    await decryptPrivateKey();
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 rounded-2xl border border-border bg-card/60 backdrop-blur p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Keys</h1>

        <div className="space-y-2">
          <Row label="Are keys set?">
            <Value onClick={() => copyToClipboard(areKeysSet ? "Yes" : "No")}>
              {areKeysSet ? "Yes" : "No"}
            </Value>
          </Row>
          <Row label="Is this browser unlocked?">
            <Value
              onClick={() => copyToClipboard(isBrowserUnlocked ? "Yes" : "No")}
            >
              {isBrowserUnlocked ? "Yes" : "No"}
            </Value>
          </Row>
          <Row label="Public key">
            <Value
              title={userData?.publicKey || ""}
              onClick={() => copyToClipboard(userData?.publicKey)}
            >
              {userData?.publicKey || "—"}
            </Value>
          </Row>
          <Row label="Encrypted private key">
            <Value
              title={userData?.privateKeyEncrypted || ""}
              onClick={() => copyToClipboard(userData?.privateKeyEncrypted)}
            >
              {userData?.privateKeyEncrypted || "—"}
            </Value>
          </Row>
          <Row label="Decrypted private key">
            <Value
              title={privateKeyDecrypted || ""}
              onClick={() => copyToClipboard(privateKeyDecrypted)}
            >
              {privateKeyDecrypted || "—"}
            </Value>
          </Row>
        </div>

        <div className="pt-2 flex gap-3">
          <Button variant="secondary" onClick={simulateNewAccount}>
            Simulate new account
          </Button>
          <Button variant="secondary" onClick={simulateNewBrowser}>
            Simulate new browser
          </Button>
        </div>

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
          <Row label="Private Key (decrypted locally)">
            <Value
              title={privateKeyDecrypted || ""}
              onClick={() => copyToClipboard(privateKeyDecrypted)}
            >
              {privateKeyDecrypted ||
                (passphrase ? "Invalid passphrase or no data" : "—")}
            </Value>
          </Row>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-56 shrink-0 text-muted-foreground">{label}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Value({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <div
      className="rounded-md bg-muted px-3 py-2 text-xs truncate cursor-pointer select-none"
      onClick={onClick}
      title={title}
      role="button"
      aria-label="Copy value"
    >
      {children}
    </div>
  );
}
