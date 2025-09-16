import { InvitationEntity } from './invitation.entity';
import { InvitationNormalized, InvitationSerialized } from './invitation.interface';

export class InvitationSerializer {
  public static normalize(entity: InvitationEntity): InvitationNormalized {
    return {
      id: entity._id.toString(),
      projectId: entity.projectId.toString(),
      authorId: entity.authorId.toString(),
      temporaryPublicKey: entity.temporaryPublicKey,
      temporaryPrivateKey: entity.temporaryPrivateKey,
      temporaryServerPassphrase: entity.temporaryServerPassphrase,
    };
  }

  public static serialize(normalized: InvitationNormalized): InvitationSerialized {
    return {
      id: normalized.id,
      projectId: normalized.projectId,
      authorId: normalized.authorId,
      temporaryPublicKey: normalized.temporaryPublicKey,
      temporaryPrivateKey: normalized.temporaryPrivateKey,
      temporaryServerPassphrase: normalized.temporaryServerPassphrase,
    };
  }
}
