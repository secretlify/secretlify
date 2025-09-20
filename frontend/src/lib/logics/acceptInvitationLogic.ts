import { actions, connect, kea, key, listeners, path, props } from "kea";

import type { acceptInvitationLogicType } from "./acceptInvitationLogicType";
import { authLogic } from "./authLogic";
import { loaders } from "kea-loaders";
import { InvitationsApi, type Invitation } from "../api/invitations.api";
import { subscriptions } from "kea-subscriptions";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";

export interface AcceptInvitationLogicProps {
  invitationId: string;
}

export const acceptInvitationLogic = kea<acceptInvitationLogicType>([
  path(["src", "lib", "logics", "acceptInvitationLogic"]),

  props({} as AcceptInvitationLogicProps),

  key((props) => props.invitationId),

  connect({
    values: [authLogic, ["jwtToken", "userData"]],
  }),

  actions({
    loadInvitation: true,
    acceptInvitation: (passphrase: string) => ({ passphrase }),
  }),

  loaders(({ values, props }) => ({
    invitation: [
      null as Invitation | null,
      {
        loadInvitation: async () => {
          const invitation = await InvitationsApi.getInvitation(
            values.jwtToken!,
            props.invitationId
          );

          return invitation;
        },
      },
    ],
  })),

  listeners(({ values }) => ({
    acceptInvitation: async ({ passphrase }) => {
      const passphraseAsKey =
        await SymmetricCrypto.deriveBase64KeyFromPassphrase(passphrase);

      const decryptedTempPrivateKey = await SymmetricCrypto.decrypt(
        values.invitation!.temporaryPrivateKey,
        passphraseAsKey
      );

      // decrypt server key using temp key from the invitation (that key was still encrypted using passphrase)
      const decryptedServerPassphrase = await AsymmetricCrypto.decrypt(
        values.invitation!.temporaryServerPassphrase,
        decryptedTempPrivateKey
      );

      // re-encrypt server key using my real public key
      const encryptedServerPassphrase = await AsymmetricCrypto.encrypt(
        decryptedServerPassphrase,
        values.userData!.publicKey!
      );

      await InvitationsApi.acceptInvitation(
        values.jwtToken!,
        values.invitation!.id,
        {
          newServerPassphrase: encryptedServerPassphrase,
        }
      );
    },
  })),

  subscriptions(({ actions }) => ({
    jwtToken: (jwtToken) => {
      if (!jwtToken) {
        return;
      }

      actions.loadInvitation();
    },
  })),
]);
