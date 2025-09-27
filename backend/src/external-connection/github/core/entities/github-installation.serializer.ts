import { GithubInstallationLiveData } from '../../client/dto/github-installation.dto';
import { GithubInstallationEntity } from './github-installation.entity';
import {
  GithubInstallationNormalized,
  GithubInstallationSerialized,
} from './github-installation.interface';

export class GithubInstallationSerializer {
  public static normalize(entity: GithubInstallationEntity): GithubInstallationNormalized {
    return {
      id: entity._id.toString(),
      githubInstallationId: entity.githubInstallationId,
      userId: entity.userId.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static serialize(
    normalized: GithubInstallationNormalized,
    extraProps?: {
      liveData?: GithubInstallationLiveData;
    },
  ): GithubInstallationSerialized {
    return {
      id: normalized.id,
      githubInstallationId: normalized.githubInstallationId,
      userId: normalized.userId,
      liveData: extraProps?.liveData,
      createdAt: normalized.createdAt.toISOString(),
      updatedAt: normalized.updatedAt.toISOString(),
    };
  }
}
