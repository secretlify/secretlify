import { UserPartialSerialized } from 'src/user/core/entities/user.interface';
import { ProjectSecretsVersionEntity } from './project-secrets-version.entity';
import {
  ProjectSecretsVersionNormalized,
  ProjectSecretsVersionSerialized,
} from './project-secrets-version.interface';

export class ProjectSecretsVersionSerializer {
  public static normalize(entity: ProjectSecretsVersionEntity): ProjectSecretsVersionNormalized {
    return {
      id: entity._id.toString(),
      projectId: entity.projectId.toString(),
      authorId: entity.authorId?.toString(),
      encryptedSecrets: entity.encryptedSecrets,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static serialize(
    version: ProjectSecretsVersionEntity,
    author: UserPartialSerialized,
  ): ProjectSecretsVersionSerialized {
    return {
      id: version._id.toString(),
      encryptedSecrets: version.encryptedSecrets,
      createdAt: version.createdAt.toISOString(),
      updatedAt: version.updatedAt.toISOString(),
      author,
    };
  }

  public static serializeMany(
    versions: ProjectSecretsVersionEntity[],
    users: UserPartialSerialized[],
  ): ProjectSecretsVersionSerialized[] {
    const usersMap = new Map(users.map((u) => [u.id, u]));

    const serializedVersions: ProjectSecretsVersionSerialized[] = [];

    for (const version of versions) {
      const author = usersMap.get(version.authorId.toString());
      if (author) {
        serializedVersions.push(ProjectSecretsVersionSerializer.serialize(version, author));
      }
    }

    return serializedVersions;
  }
}
