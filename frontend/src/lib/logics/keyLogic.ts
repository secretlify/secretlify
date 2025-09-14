import { actions, defaults, kea, path, reducers, selectors } from "kea";
import { loaders } from "kea-loaders";

import type { keyLogicType } from "./keyLogicType";
import type { KeyPair } from "../crypto/crypto.asymmetric";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";

export const keyLogic = kea<keyLogicType>([
  path(["src", "lib", "logics", "keyLogic"]),

  actions({
    setPassphrase: (passphrase: string) => ({ passphrase }),
    reset: true,
  }),

  defaults({
    keyPair: null as KeyPair | null,
    simulateShouldDoSetup: false,
  }),

  reducers({
    keyPair: [
      null as KeyPair | null,
      {
        persist: true,
      },
      {
        reset: () => null,
      },
    ],
  }),

  selectors({
    shouldSetUpPassphrase: [
      (state) => [state.simulateShouldDoSetup],
      (simulateShouldDoSetup) => Boolean(simulateShouldDoSetup),
    ],
  }),

  loaders(({ values }) => ({
    keyPair: {
      generateKeyPair: async (): Promise<KeyPair> => {
        if (values.keyPair) {
          return values.keyPair;
        }
        const generated = await AsymmetricCrypto.generateKeyPair();
        return generated;
      },
    },
    encryptedPrivateKey: {
      encryptPrivateKey: async (passphrase: string): Promise<string> => {
        if (!values.keyPair) {
          throw new Error("Key pair not available");
        }
        const base64Key = await SymmetricCrypto.deriveBase64KeyFromPassphrase(
          passphrase
        );
        const encrypted = await SymmetricCrypto.encrypt(
          values.keyPair.privateKey,
          base64Key
        );

        console.log("Sending this to server", {
          publicKey: values.keyPair.publicKey,
          privateKey: encrypted,
        });

        return encrypted;
      },
    },
  })),
]);
