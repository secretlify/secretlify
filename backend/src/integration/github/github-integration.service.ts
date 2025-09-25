import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubClient } from 'src/integration/github/github.client';
import {
  CreateIntegrationDto,
  IIntegrationProvider,
  ProviderIntegrationSerialized,
} from 'src/integration/core/interfaces/integration-provider.interface';
import { EncryptionService } from 'src/shared/encryption/encryption.service';
import { GithubIntegrationWriteService } from 'src/integration/github/write/github-integration-write.service';
import { GithubIntegrationReadService } from 'src/integration/github/read/github-integration-read.service';
import { Logger } from '@logdash/js-sdk';
import { AccessibleRepositoryDto } from 'src/integration/github/dto/get-accessible-repositories.dto';
import { ProjectReadService } from 'src/project/read/project-read.service';
import { GithubIntegrationSerializer } from 'src/integration/github/entities/github-integration.serializer';
import { ProjectNormalized } from 'src/project/core/entities/project.interface';
import { GithubIntegrationNormalized } from 'src/integration/github/entities/github-integration.interface';

@Injectable()
export class GithubIntegrationService implements IIntegrationProvider {
  public constructor(
    private readonly client: GithubClient,
    private readonly logger: Logger,
    private readonly encryptionService: EncryptionService,
    private readonly githubIntegrationWriteService: GithubIntegrationWriteService,
    private readonly githubIntegrationReadService: GithubIntegrationReadService,
    private readonly projectReadService: ProjectReadService,
  ) {}

  public async test() {
    /**
     * cryptly-dev installationId: 87445864
     * ablaszkiewicz installationId: 87228122
     * arturwita installationId: 87207622
     *
     * arturwita/jamaica:
     * repositoryId: 1062759744
     * keyId: "3380204578043523366"
     * publicKey: "MnHZLJHhP7HtOWl875N97yFFi8W2Fui9hrzw2XelzCk="
     */
    // return this.client.getAccessibleRepositories(87207622);
    return this.client.createAccessToken();
    // return this.client.getRepositoryById({ repositoryId: 1062759744, installationId: 87207622 });
    // return this.client.getRepositoryPublicKey({
    //   repositoryName: 'jamaica',
    //   owner: 'arturwita',
    //   installationId: 87207622,
    // });
    // return this.client.getInstallationId();
  }

  public async createAccessToken() {
    return this.client.createAccessToken();
  }

  public async create(dto: CreateIntegrationDto): Promise<ProviderIntegrationSerialized> {
    const repositoryId = Number.parseInt(dto.repositoryId, 10);
    if (isNaN(repositoryId)) {
      this.logger.error('Invalid github repository id', { originalRepositoryId: dto.repositoryId });
      throw new BadRequestException('Invalid github repository id');
    }

    const installationId = await this.getInstallationId(null);
    const repository = await this.client.getRepositoryById({ repositoryId, installationId });

    const publicKey = await this.client.getRepositoryPublicKey({
      repositoryName: repository.name,
      owner: repository.owner,
      installationId,
    });

    const integration = await this.githubIntegrationWriteService.create({
      cryptlyProjectId: dto.projectId,
      githubRepositoryId: repositoryId,
      repositoryPublicKey: publicKey.key,
      repositoryPublicKeyId: publicKey.keyId,
    });

    return GithubIntegrationSerializer.serialize(integration);
  }

  private async getInstallationId(integrationId: string | null): Promise<number> {
    if (!integrationId) {
      return this.client.getInstallationId();
    }
    const integration = await this.githubIntegrationReadService.findById(integrationId);
    const project = await this.projectReadService.findById(integration.cryptlyProjectId);

    if (!project.integrations.githubInstallationId) {
      return this.client.getInstallationId();
    }

    return project.integrations.githubInstallationId;
  }

  public async getAccessibleRepositories(
    name: string,
    installationId: number,
  ): Promise<AccessibleRepositoryDto[]> {
    const repositories = await this.client.getAccessibleRepositories(installationId);

    return repositories.filter((repo) => repo.fullName.includes(name));
  }

  public async upsertSecrets(projectId: string): Promise<void> {
    const result = await Promise.all([
      this.projectReadService.findById(projectId),
      this.githubIntegrationReadService.findByProjectId(projectId),
    ]);
    const project = result[0] as ProjectNormalized;
    const integration = result[1] as GithubIntegrationNormalized;

    if (!project.integrations.githubInstallationId) {
      this.logger.error('Cannot import secrets to project which has not installed the app', {
        projectId,
      });
      throw new BadRequestException('Invalid project selected');
    }

    const repository = await this.client.getRepositoryById({
      repositoryId: integration.githubRepositoryId,
      installationId: project.integrations.githubInstallationId,
    });

    const { failedSecrets } = await this.client.upsertSecrets({
      secrets: project.encryptedSecretsKeys, // todo: ensure that encrypted via libsodium
      keyId: integration.repositoryPublicKeyId,
      repositoryName: repository.name,
      repositoryOwner: repository.owner,
      installationId: project.integrations.githubInstallationId,
    });

    if (failedSecrets.length > 0) {
      this.logger.error('Failed to upsert some secrets', {
        failedCount: failedSecrets.length,
        failedSecrets,
      });
      // todo: throw or handle/retry
    }
  }
}
