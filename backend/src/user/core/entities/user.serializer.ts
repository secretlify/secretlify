import { UserEntity } from './user.entity';
import {
  UserNormalized,
  UserPartialNormalized,
  UserPartialSerialized,
  UserSerialized,
} from './user.interface';

export class UserSerializer {
  public static normalize(entity: UserEntity): UserNormalized {
    return {
      id: entity._id.toString(),
      authMethod: entity.authMethod,
      email: entity.email,
      avatarUrl: entity.avatarUrl,
      privateKeyEncrypted: entity.privateKeyEncrypted,
      publicKey: entity.publicKey,
    };
  }

  public static serialize(normalized: UserNormalized): UserSerialized {
    return {
      id: normalized.id,
      authMethod: normalized.authMethod,
      email: normalized.email,
      avatarUrl: normalized.avatarUrl,
      privateKeyEncrypted: normalized.privateKeyEncrypted,
      publicKey: normalized.publicKey,
    };
  }

  public static serializePartial(normalized: UserPartialNormalized): UserPartialSerialized {
    return {
      id: normalized.id,
      email: normalized.email,
      avatarUrl: normalized.avatarUrl,
    };
  }
}
