import { UserId } from 'src/shared/types/user-id';
import { ProjectEntity } from './project.entity';
import {
  ProjectHistorySerialized,
  ProjectNormalized,
  ProjectSerialized,
} from './project.interface';

export class ProjectSerializer {
  public static normalize(entity: ProjectEntity): ProjectNormalized {
    return {
      id: entity._id.toString(),
      name: entity.name,
      owner: entity.owner.toString() as UserId,
      members: entity.members.map((member) => member.toString() as UserId),
      encryptedKeyVersions: entity.encryptedSecretsKeys,
      encryptedSecretsHistory: entity.encryptedSecretsHistory,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static serialize(normalized: ProjectNormalized): ProjectSerialized {
    return {
      id: normalized.id,
      name: normalized.name,
      owner: normalized.owner,
      members: normalized.members,
      encryptedKeyVersions: normalized.encryptedKeyVersions,
      encryptedSecrets: normalized.encryptedSecretsHistory[0],
      createdAt: normalized.createdAt.toISOString(),
      updatedAt: normalized.updatedAt.toISOString(),
    };
  }

  public static serializeHistory(normalized: ProjectNormalized): ProjectHistorySerialized {
    return {
      id: normalized.id,
      name: normalized.name,
      owner: normalized.owner,
      members: normalized.members,
      encryptedKeyVersions: normalized.encryptedKeyVersions,
      encryptedSecretsHistory: normalized.encryptedSecretsHistory,
    };
  }
}
