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
import type { User } from "../api/user.api";

export const keyLogic = kea<keyLogicType>([
  path(["src", "lib", "logics", "keyLogic"]),

  connect({
    values: [authLogic, ["userData"]],
    actions: [authLogic, ["setUserData"]],
  }),

  actions({
    setUpPassphrase: (passphrase: string) => ({ passphrase }),
    setLocalKeyPair: (keyPair: { publicKey: string; privateKey: string }) => ({
      keyPair,
    }),
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
    localKeyPair: [
      null as { publicKey: string; privateKey: string } | null,
      {},
      {
        setLocalKeyPair: (
          _: { publicKey: string; privateKey: string } | null,
          { keyPair }: { keyPair: { publicKey: string; privateKey: string } }
        ) => keyPair,
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

      actions.setLocalKeyPair(keyPair);
      actions.setLocalEncryptedPrivateKey(encrypted);

      const updatedUser: User = {
        ...values.userData,
        publicKey: keyPair.publicKey,
        encryptedPrivateKey: encrypted,
      };
      actions.setUserData(updatedUser);
    },
  })),
]);
