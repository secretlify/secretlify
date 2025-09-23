import { UserPartialSerialized } from 'src/user/core/entities/user.interface';
import { InvitationEntity } from './invitation.entity';
import { InvitationNormalized, InvitationSerialized } from './invitation.interface';

export class InvitationSerializer {
  public static normalize(entity: InvitationEntity): InvitationNormalized {
    return {
      id: entity._id.toString(),
      projectId: entity.projectId.toString(),
      authorId: entity.authorId.toString(),
      role: entity.role,
      temporaryPublicKey: entity.temporaryPublicKey,
      temporaryPrivateKey: entity.temporaryPrivateKey,
      temporarySecretsKey: entity.temporarySecretsKey,
      createdAt: entity.createdAt,
    };
  }

  public static serialize(
    normalized: InvitationNormalized,
    author: UserPartialSerialized,
  ): InvitationSerialized {
    return {
      id: normalized.id,
      projectId: normalized.projectId,
      role: normalized.role,
      author: {
        id: author.id,
        email: author.email,
        avatarUrl: author.avatarUrl,
      },
      temporaryPublicKey: normalized.temporaryPublicKey,
      temporaryPrivateKey: normalized.temporaryPrivateKey,
      temporarySecretsKey: normalized.temporarySecretsKey,
      createdAt: normalized.createdAt.toISOString(),
    };
  }
}
