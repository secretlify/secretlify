import {
  actions,
  connect,
  kea,
  listeners,
  path,
  reducers,
  selectors,
} from "kea";
import { loaders } from "kea-loaders";

import type { keyLogicType } from "./keyLogicType";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { authLogic } from "./authLogic";
import type { User } from "../api/user.api";

export const keyLogic = kea<keyLogicType>([
  path(["src", "lib", "logics", "keyLogic"]),

  connect({
    values: [authLogic, ["userData"]],
    actions: [authLogic, ["setUserData"]],
  }),

  actions({
    setUpPassphrase: (passphrase: string) => ({ passphrase }),
    setPassphrase: (passphrase: string) => ({ passphrase }),
    setLocalEncryptedPrivateKey: (encryptedPrivateKey: string) => ({
      encryptedPrivateKey,
    }),
  }),

  selectors({
    shouldSetUpPassphrase: [
      (state) => [state.userData],
      (userData: User | null) =>
        Boolean(userData) &&
        (!userData!.publicKey || !userData!.encryptedPrivateKey),
    ],
  }),

  reducers({
    passphrase: [
      null as string | null,
      {
        persist: true,
      },
      {
        setPassphrase: (
          _: string | null,
          { passphrase }: { passphrase: string }
        ) => passphrase,
      },
    ],
    localEncryptedPrivateKey: [
      null as string | null,
      {},
      {
        setLocalEncryptedPrivateKey: (
          _: string | null,
          { encryptedPrivateKey }: { encryptedPrivateKey: string }
        ) => encryptedPrivateKey,
      },
    ],
  }),

  loaders(({ values }) => ({
    privateKeyDecrypted: {
      decryptPrivateKey: async (): Promise<string | null> => {
        const encrypted = values.userData?.encryptedPrivateKey;
        const passphrase = values.passphrase;
        if (!encrypted || !passphrase) return null;
        const base64Key = await SymmetricCrypto.deriveBase64KeyFromPassphrase(
          passphrase
        );
        try {
          const decrypted = await SymmetricCrypto.decrypt(encrypted, base64Key);
          return decrypted;
        } catch (e) {
          return null;
        }
      },
    },
  })),

  listeners(({ actions, values }) => ({
    setUpPassphrase: async ({ passphrase }) => {
      if (!values.userData) {
        return;
      }
      const keyPair = await AsymmetricCrypto.generateKeyPair();
      const base64Key = await SymmetricCrypto.deriveBase64KeyFromPassphrase(
        passphrase
      );
      const encrypted = await SymmetricCrypto.encrypt(
        keyPair.privateKey,
        base64Key
      );

      console.log("Sending this to server", {
        publicKey: keyPair.publicKey,
        privateKey: encrypted,
      });

      actions.setLocalEncryptedPrivateKey(encrypted);
      actions.setPassphrase(passphrase);

      const updatedUser: User = {
        ...values.userData,
        publicKey: keyPair.publicKey,
        encryptedPrivateKey: encrypted,
      };
      actions.setUserData(updatedUser);
      actions.decryptPrivateKey();
    },
  })),
]);
