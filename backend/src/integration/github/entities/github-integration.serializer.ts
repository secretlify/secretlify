import { GithubIntegrationNormalized } from './github-integration.interface';
import { GithubIntegrationEntity } from 'src/integration/github/entities/github-integration.entity';
import { ProviderIntegrationSerialized } from 'src/integration/core/interfaces/integration-provider.interface';
import { IntegrationType } from 'src/integration/core/enums/integration-type.enum';

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

  public static serialize(normalized: GithubIntegrationNormalized): ProviderIntegrationSerialized {
    return {
      id: normalized.id,
      cryptlyProjectId: normalized.cryptlyProjectId,
      repositoryId: `${normalized.githubRepositoryId}`,
      type: IntegrationType.Github,
      createdAt: normalized.createdAt.toISOString(),
      updatedAt: normalized.updatedAt.toISOString(),
    };
  }
}
