import { UserId } from 'src/shared/types/user-id';
import { ProjectEntity } from './project.entity';
import { EnvName, ProjectNormalized, ProjectSerialized } from './project.interface';

export class ProjectSerializer {
  public static normalize(entity: ProjectEntity): ProjectNormalized {
    return {
      id: entity._id.toString(),
      name: entity.name,
      owner: entity.owner.toString() as UserId,
      members: entity.members.map((member) => member.toString()) as UserId[],
      encryptedPassphrases: entity.encryptedPassphrases,
      encryptedSecrets: entity.encryptedSecrets as Record<EnvName, string>,
    };
  }

  public static serialize(normalized: ProjectNormalized): ProjectSerialized {
    return {
      id: normalized.id,
      name: normalized.name,
      owner: normalized.owner,
      members: normalized.members,
      encryptedPassphrases: normalized.encryptedPassphrases,
      encryptedSecrets: normalized.encryptedSecrets,
    };
  }
}
