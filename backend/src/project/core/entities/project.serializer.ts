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
      members: entity.members,
      encryptedKeyVersions: entity.encryptedSecretsKeys,
      encryptedSecretsHistory: entity.encryptedSecretsHistory,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static serialize(normalized: ProjectNormalized): ProjectSerialized {
    const members = {};
    for (const [key, value] of normalized.members.entries()) {
      members[key] = value;
    }

    return {
      id: normalized.id,
      name: normalized.name,
      members: members,
      encryptedKeyVersions: normalized.encryptedKeyVersions,
      encryptedSecrets: normalized.encryptedSecretsHistory[0],
      createdAt: normalized.createdAt.toISOString(),
      updatedAt: normalized.updatedAt.toISOString(),
    };
  }

  public static serializeHistory(normalized: ProjectNormalized): ProjectHistorySerialized {
    const members = {};
    for (const [key, value] of normalized.members.entries()) {
      members[key] = value;
    }

    return {
      id: normalized.id,
      name: normalized.name,
      members: members,
      encryptedKeyVersions: normalized.encryptedKeyVersions,
      encryptedSecretsHistory: normalized.encryptedSecretsHistory,
    };
  }
}
