import { Button } from "@/components/ui/button";
import { cn, defaultLoader } from "@/lib/utils";
import { Encryption, type KeyPair } from "@/lib/encryption";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/project/$projectId")({
  component: ProjectEditor,
  loader: defaultLoader,
});

function ProjectEditor() {
  const { projectId } = useParams({ from: "/app/project/$projectId" });
  const [value, setValue] = useState("");
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const kp = await Encryption.generateKeyPair();
        if (active) setKeyPair(kp);
      } catch {
        if (active) setKeyPair(null);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  const [symPass, setSymPass] = useState(() => randomString(10));

  // Derive a 32-byte key from 10-char passphrase using Web Crypto SHA-256, then base64 for Encryption API
  const [derivedSymKeyB64, setDerivedSymKeyB64] = useState("");
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const passBytes = new TextEncoder().encode(symPass);
        const digestBuf = await window.crypto.subtle.digest(
          "SHA-256",
          passBytes
        );
        const digest = new Uint8Array(digestBuf);
        if (active) setDerivedSymKeyB64(u8ToB64(digest));
      } catch {
        if (active) setDerivedSymKeyB64("");
      }
    })();
    return () => {
      active = false;
    };
  }, [symPass]);

  // Asymmetric: encrypt the 10-char passphrase with public key, decrypt with private key
  const [asymEncryptedPass, setAsymEncryptedPass] = useState("");
  const [asymDecryptedPass, setAsymDecryptedPass] = useState("");
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!keyPair) {
          if (active) {
            setAsymEncryptedPass("");
            setAsymDecryptedPass("");
          }
          return;
        }
        const enc = await Encryption.encryptAsymetric(
          symPass,
          keyPair.publicKey
        );
        const dec = await Encryption.decryptAsymetric(enc, keyPair.privateKey);
        if (active) {
          setAsymEncryptedPass(enc);
          setAsymDecryptedPass(dec);
        }
      } catch {
        if (active) {
          setAsymEncryptedPass("");
          setAsymDecryptedPass("");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [symPass, keyPair]);

  // Symmetric: encrypt and decrypt the textarea content using derived 32-byte key
  const [symEncryptedText, setSymEncryptedText] = useState("");
  const [symDecryptedText, setSymDecryptedText] = useState("");
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!value || !derivedSymKeyB64) {
          if (active) {
            setSymEncryptedText("");
            setSymDecryptedText("");
          }
          return;
        }
        const enc = await Encryption.encrypt(value, derivedSymKeyB64);
        const dec = await Encryption.decrypt(enc, derivedSymKeyB64);
        if (active) {
          setSymEncryptedText(enc);
          setSymDecryptedText(dec);
        }
      } catch {
        if (active) {
          setSymEncryptedText("");
          setSymDecryptedText("");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [value, derivedSymKeyB64]);

  const onSubmit = () => {
    // Placeholder submit action
    // eslint-disable-next-line no-alert
    alert(
      `Submitted content for project ${projectId}:\n\n${value.substring(
        0,
        200
      )}${value.length > 200 ? "..." : ""}`
    );
  };

  return (
    <div className="w-full max-h-screen overflow-y-auto">
      <div className="w-full">
        <div
          className={
            "rounded-2xl border border-border bg-card/60 backdrop-blur"
          }
        >
          <div className="p-2 pb-0">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type or paste your content here..."
              className={cn(
                "w-full",
                "rounded-xl bg-background/60 text-foreground",
                "outline-none border border-transparent focus:border-ring",
                "p-4 md:p-5 leading-relaxed text-base md:text-lg",
                "placeholder:text-muted-foreground/70"
              )}
            />
          </div>
          <div className="p-2">
            <div className="flex items-center justify-end">
              <Button
                size="lg"
                className={cn(
                  "h-12 px-8 rounded-xl",
                  "bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600",
                  "hover:from-blue-500 hover:via-fuchsia-500 hover:to-pink-500",
                  "text-white shadow-lg shadow-fuchsia-600/20"
                )}
                onClick={onSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="font-semibold">Asymmetric Key Pair</div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSymPass(randomString(10))}
            >
              Regenerate Sym Pass
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm break-all">
            <div>
              <div className="text-muted-foreground">Public Key (base64)</div>
              <div className="select-all">{keyPair?.publicKey ?? ""}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Private Key (base64)</div>
              <div className="select-all">{keyPair?.privateKey ?? ""}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm break-all">
            <div>
              <div className="text-muted-foreground">
                Symmetric Passphrase (10 chars)
              </div>
              <div className="select-all">{symPass}</div>
            </div>
            <div>
              <div className="text-muted-foreground">
                Derived Symmetric Key (SHA-256 → base64)
              </div>
              <div className="select-all">{derivedSymKeyB64}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm break-all">
            <div>
              <div className="text-muted-foreground">
                Asym Encrypted Passphrase
              </div>
              <div className="select-all">{asymEncryptedPass}</div>
            </div>
            <div>
              <div className="text-muted-foreground">
                Asym Decrypted Passphrase
              </div>
              <div className="select-all">{asymDecryptedPass}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm break-all">
            <div>
              <div className="text-muted-foreground">Sym Encrypted Text</div>
              <div className="select-all">{symEncryptedText}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Sym Decrypted Text</div>
              <div className="select-all">{symDecryptedText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function randomString(length: number): string {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  (crypto || (window as any).msCrypto).getRandomValues(array);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[array[i] % alphabet.length];
  }
  return out;
}

function u8ToB64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
