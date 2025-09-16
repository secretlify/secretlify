import { UserId } from 'src/shared/types/user-id';
import { ProjectEntity } from './project.entity';
import { EnvName, ProjectNormalized, ProjectSerialized } from './project.interface';

export class ProjectSerializer {
  public static normalize(entity: ProjectEntity): ProjectNormalized {
    return {
      id: entity._id.toString(),
      name: entity.name,
      owner: entity.owner.toString() as UserId,
      encryptedPassphrase: entity.encryptedPassphrase,
      encryptedSecrets: entity.encryptedSecrets,
    };
  }

  public static serialize(normalized: ProjectNormalized): ProjectSerialized {
    return {
      id: normalized.id,
      name: normalized.name,
      owner: normalized.owner,
      encryptedPassphrase: normalized.encryptedPassphrase,
      encryptedSecrets: normalized.encryptedSecrets,
    };
  }
}
