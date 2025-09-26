import {
  GithubIntegrationNormalized,
  GithubIntegrationSerialized,
} from './github-integration.interface';
import { GithubIntegrationEntity } from 'src/integration/github/entities/github-integration.entity';

export class GithubIntegrationSerializer {
  public static normalize(entity: GithubIntegrationEntity): GithubIntegrationNormalized {
    return {
      id: entity._id.toString(),
      cryptlyProjectId: entity.cryptlyProjectId.toString(),
      githubRepositoryId: entity.githubRepositoryId,
      repositoryPublicKey: entity.repositoryPublicKey,
      repositoryPublicKeyId: entity.repositoryPublicKeyId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static serialize(normalized: GithubIntegrationNormalized): GithubIntegrationSerialized {
    return {
      id: normalized.id,
      cryptlyProjectId: normalized.cryptlyProjectId,
      githubRepositoryId: normalized.githubRepositoryId,
      repositoryPublicKey: normalized.repositoryPublicKey,
      repositoryPublicKeyId: normalized.repositoryPublicKeyId,
      createdAt: normalized.createdAt.toISOString(),
      updatedAt: normalized.updatedAt.toISOString(),
    };
  }
}
