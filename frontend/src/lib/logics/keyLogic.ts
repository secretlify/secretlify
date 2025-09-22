import {
  actions,
  connect,
  kea,
  listeners,
  path,
  reducers,
  selectors,
} from "kea";

import type { keyLogicType } from "./keyLogicType";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { authLogic } from "./authLogic";
import { UserApi, type User } from "../api/user.api";
import { subscriptions } from "kea-subscriptions";

export const keyLogic = kea<keyLogicType>([
  path(["src", "lib", "logics", "keyLogic"]),

  connect({
    values: [authLogic, ["userData", "jwtToken"]],
    actions: [authLogic, ["loadUserData"]],
  }),

  actions({
    // reducers
    setPassphrase: (passphrase: string) => ({ passphrase }),
    setPrivateKeyDecrypted: (privateKeyDecrypted: string | null) => ({
      privateKeyDecrypted,
    }),

    // listeners
    setUpPassphrase: (passphrase: string) => ({ passphrase }),
    decryptPrivateKey: true,
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
    privateKeyDecrypted: [
      null as string | null,
      {
        persist: true,
      },
      {
        setPrivateKeyDecrypted: (
          _: string | null,
          { privateKeyDecrypted }: { privateKeyDecrypted: string | null }
        ) => privateKeyDecrypted,
      },
    ],
  }),

  selectors({
    shouldSetUpPassphrase: [
      (state) => [state.userData],
      (userData: User | null) =>
        Boolean(userData) &&
        (!userData!.publicKey || !userData!.privateKeyEncrypted),
    ],
    browserIsUnlocked: [
      (state) => [state.privateKeyDecrypted],
      (privateKeyDecrypted: string | null) => Boolean(privateKeyDecrypted),
    ],
  }),

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

      actions.setPassphrase(passphrase);

      await UserApi.updateMe(values.jwtToken!, {
        publicKey: keyPair.publicKey,
        privateKeyEncrypted: encrypted,
      });

      await actions.loadUserData();
    },
    decryptPrivateKey: async (): Promise<void> => {
      const encrypted = values.userData?.privateKeyEncrypted;
      const passphrase = values.passphrase;
      if (!passphrase) {
        actions.setPrivateKeyDecrypted(null);
        return;
      }

      if (!encrypted) {
        return;
      }

      const base64Key = await SymmetricCrypto.deriveBase64KeyFromPassphrase(
        passphrase
      );
      try {
        const decrypted = await SymmetricCrypto.decrypt(encrypted, base64Key);
        actions.setPrivateKeyDecrypted(decrypted);
      } catch (e) {
        actions.setPrivateKeyDecrypted(null);
        throw Error("Invalid passphrase");
      }
    },
  })),

  subscriptions(({ actions }) => ({
    passphrase: () => {
      actions.decryptPrivateKey();
    },
    userData: () => {
      actions.decryptPrivateKey();
    },
  })),
]);
