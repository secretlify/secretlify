import { UserPartialSerialized } from '../../../user/core/entities/user.interface';
import { ProjectEntity } from './project.entity';
import { ProjectMemberSerialized, ProjectNormalized, ProjectSerialized } from './project.interface';

export class ProjectSerializer {
  public static normalize(entity: ProjectEntity): ProjectNormalized {
    return {
      id: entity._id.toString(),
      name: entity.name,
      members: entity.members,
      encryptedSecretsKeys: entity.encryptedSecretsKeys,
      githubInstallationId: entity.githubInstallationId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static serialize(
    normalized: ProjectNormalized,
    membersDetails: UserPartialSerialized[],
    latestSecrets: string,
  ): ProjectSerialized {
    const membersMap = new Map(membersDetails.map((m) => [m.id, m]));
    const members: ProjectMemberSerialized[] = [];

    for (const [userId, role] of normalized.members.entries()) {
      const userDetails = membersMap.get(userId);
      if (userDetails) {
        members.push({
          id: userDetails.id,
          email: userDetails.email,
          avatarUrl: userDetails.avatarUrl,
          role,
        });
      }
    }

    return {
      id: normalized.id,
      name: normalized.name,
      members: members,
      encryptedSecretsKeys: normalized.encryptedSecretsKeys,
      githubInstallationId: normalized.githubInstallationId,
      encryptedSecrets: latestSecrets,
      createdAt: normalized.createdAt.toISOString(),
      updatedAt: normalized.updatedAt.toISOString(),
    };
  }
}
