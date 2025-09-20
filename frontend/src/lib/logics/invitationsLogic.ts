import {
  actions,
  connect,
  events,
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
      console.log("1");
      const keyPair = await AsymmetricCrypto.generateKeyPair();

      console.log("2");
      const keyFromPassphrase =
        await SymmetricCrypto.deriveBase64KeyFromPassphrase(passphrase);

      console.log("3");
      const encryptedPrivateKey = await SymmetricCrypto.encrypt(
        keyPair.privateKey,
        keyFromPassphrase
      );
      console.log("4");

      const serverKey = await SymmetricCrypto.generateProjectKey();

      console.log("5");

      const serverKeyEncrypted = await AsymmetricCrypto.encrypt(
        serverKey,
        keyPair.publicKey
      );

      console.log("6");

      console.log("jwt token in logic", values.jwtToken);
      await InvitationsApi.createInvitation(values.jwtToken!, {
        projectId: props.projectId,
        temporaryPublicKey: keyPair.publicKey,
        temporaryPrivateKey: encryptedPrivateKey,
        temporaryServerPassphrase: serverKeyEncrypted,
      });

      console.log("7");

      actions.loadInvitations();
    },
  })),
]);
