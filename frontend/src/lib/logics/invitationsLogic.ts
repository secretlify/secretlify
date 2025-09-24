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
import { InvitationsApi, type Invitation } from "../api/invitations.api";
import { loaders } from "kea-loaders";
import { AsymmetricCrypto } from "../crypto/crypto.asymmetric";
import { SymmetricCrypto } from "../crypto/crypto.symmetric";
import { projectLogic } from "./projectLogic";

export interface InvitationsLogicProps {
  projectId: string;
}

export const invitationsLogic = kea<invitationsLogicType>([
  path(["src", "lib", "logics", "invitationsLogic"]),

  props({} as InvitationsLogicProps),

  key((props) => props.projectId),

  connect({
    values: [authLogic, ["jwtToken"], projectLogic, ["projectData"]],
  }),

  actions({
    createInvitation: (passphrase: string, role: "admin" | "member") => ({
      passphrase,
      role,
    }),
    setInvitations: (invitations: Invitation[]) => ({ invitations }),
    deleteInvitation: (invitationId: string) => ({ invitationId }),
  }),

  reducers({
    invitations: [
      [] as Invitation[],
      {
        setInvitations: (_, { invitations }) => invitations,
      },
    ],
  }),

  loaders(({ values, props }) => ({
    invitations: {
      loadInvitations: async () => {
        const invitations = await InvitationsApi.getInvitations(
          values.jwtToken!,
          props.projectId
        );
        return invitations;
      },
    },
  })),

  listeners(({ actions, values, props }) => ({
    createInvitation: async ({ passphrase, role }) => {
      const keyPair = await AsymmetricCrypto.generateKeyPair();

      const passphraseAsKey =
        await SymmetricCrypto.deriveBase64KeyFromPassphrase(passphrase);

      const encryptedPrivateKey = await SymmetricCrypto.encrypt(
        keyPair.privateKey,
        passphraseAsKey
      );

      const serverKey = values.projectData!.passphraseAsKey;

      const serverKeyEncrypted = await AsymmetricCrypto.encrypt(
        serverKey,
        keyPair.publicKey
      );

      await InvitationsApi.createInvitation(values.jwtToken!, {
        projectId: props.projectId,
        temporaryPublicKey: keyPair.publicKey,
        temporaryPrivateKey: encryptedPrivateKey,
        temporarySecretsKey: serverKeyEncrypted,
        role: role,
      });

      actions.loadInvitations();
    },
    deleteInvitation: async ({ invitationId }) => {
      await InvitationsApi.deleteInvitation(values.jwtToken!, invitationId);
      actions.loadInvitations();
    },
  })),
]);
