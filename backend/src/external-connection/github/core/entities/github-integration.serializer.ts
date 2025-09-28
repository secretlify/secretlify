import { GithubRepository } from '../../client/dto/github-repository.dto';
import { GithubIntegrationEntity } from './github-integration.entity';
import {
  GithubIntegrationNormalized,
  GithubIntegrationSerialized,
} from './github-integration.interface';

export class GithubIntegrationSerializer {
  public static normalize(entity: GithubIntegrationEntity): GithubIntegrationNormalized {
    return {
      id: entity._id.toString(),
      projectId: entity.projectId.toString(),
      githubRepositoryId: entity.githubRepositoryId,
      githubRepositoryPublicKey: entity.githubRepositoryPublicKey,
      githubRepositoryPublicKeyId: entity.githubRepositoryPublicKeyId,
      installationEntityId: entity.installationEntityId.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static serialize(
    normalized: GithubIntegrationNormalized,
    extraProps?: {
      repositoryData?: GithubRepository;
    },
  ): GithubIntegrationSerialized {
    return {
      id: normalized.id,
      projectId: normalized.projectId,
      githubRepositoryId: normalized.githubRepositoryId,
      githubRepositoryPublicKey: normalized.githubRepositoryPublicKey,
      githubRepositoryPublicKeyId: normalized.githubRepositoryPublicKeyId,
      installationEntityId: normalized.installationEntityId,
      repositoryData: extraProps?.repositoryData,
      createdAt: normalized.createdAt.toISOString(),
      updatedAt: normalized.updatedAt.toISOString(),
    };
  }
}
