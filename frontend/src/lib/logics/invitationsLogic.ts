import {
  actions,
  connect,
  kea,
  key,
  listeners,
  path,
  props,
  reducers,
} from "kea";

import type { invitationsLogicType } from "./invitationsLogicType";
import { authLogic } from "./authLogic";
import {
  InvitationsApi,
  type CreateInvitationDto,
  type Invitation,
} from "../api/invitations.api";
import { loaders } from "kea-loaders";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";

export interface InvitationsLogicProps {
  projectId: string;
}

export const invitationsLogic = kea<invitationsLogicType>([
  path(["src", "lib", "logics", "invitationsLogic"]),

  props({} as InvitationsLogicProps),

  key((props) => props.projectId),

  connect({
    values: [authLogic, ["jwtToken"]],
  }),

  actions({
    createInvitation: (passphrase: string) => ({ passphrase }),
    setInvitations: (invitations: Invitation[]) => ({ invitations }),
  }),

  reducers({
    invitations: [
      [] as Invitation[],
      {
        setInvitations: (_, { invitations }) => invitations,
      },
    ],
  }),

  loaders(({ values }) => ({
    invitations: {
      loadInvitations: async () => {
        const invitations = await InvitationsApi.getInvitations(
          values.jwtToken!
        );
        return invitations;
      },
    },
  })),

  listeners(({ actions, values, props }) => ({
    createInvitation: async ({ passphrase }) => {
      const keyPair = await AsymmetricCrypto.generateKeyPair();

      const keyFromPassphrase =
        await SymmetricCrypto.deriveBase64KeyFromPassphrase(passphrase);

      const encryptedPrivateKey = await AsymmetricCrypto.encrypt(
        keyPair.privateKey,
        keyFromPassphrase
      );

      const serverKey = await SymmetricCrypto.generateProjectKey();

      const serverKeyEncrypted = await SymmetricCrypto.encrypt(
        serverKey,
        keyPair.publicKey
      );

      await InvitationsApi.createInvitation(values.jwtToken!, {
        projectId: props.projectId,
        temporaryPublicKey: keyPair.publicKey,
        temporaryPrivateKeyEncrypted: encryptedPrivateKey,
        temporaryServerPassphrase: serverKeyEncrypted,
      });

      actions.loadInvitations();
    },
  })),
]);
