import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubClient, GithubInstallationResponseDto } from 'src/integration/github/github.client';
import { EncryptionService } from 'src/shared/encryption/encryption.service';
import { GithubIntegrationWriteService } from 'src/integration/github/write/github-integration-write.service';
import { GithubIntegrationReadService } from 'src/integration/github/read/github-integration-read.service';
import { Logger } from '@logdash/js-sdk';
import { AccessibleRepositoryDto } from 'src/integration/github/dto/get-accessible-repositories.dto';
import { ProjectReadService } from 'src/project/read/project-read.service';
import { GithubIntegrationSerializer } from 'src/integration/github/entities/github-integration.serializer';
import {
  GithubIntegrationNormalized,
  GithubIntegrationSerialized,
} from 'src/integration/github/entities/github-integration.interface';
import { CreateGithubIntegrationDto } from 'src/integration/github/dto/create-github-integration.dto';
import { GetGithubIntegrationsDto } from 'src/integration/github/dto/get-github-integrations.dto';
import { UpdateSecretsBodyDto } from 'src/integration/github/dto/update-secrets.dto';

@Injectable()
export class GithubIntegrationService {
  public constructor(
    private readonly client: GithubClient,
    private readonly logger: Logger,
    private readonly encryptionService: EncryptionService,
    private readonly githubIntegrationWriteService: GithubIntegrationWriteService,
    private readonly githubIntegrationReadService: GithubIntegrationReadService,
    private readonly projectReadService: ProjectReadService,
  ) {}

  public async createAccessToken() {
    return this.client.createAccessToken();
  }

  public async create({
    projectId,
    repositoryId,
    installationId,
  }: CreateGithubIntegrationDto): Promise<GithubIntegrationSerialized> {
    const repository = await this.client.getRepositoryById({ repositoryId, installationId });

    const publicKey = await this.client.getRepositoryPublicKey({
      repositoryName: repository.name,
      owner: repository.owner,
      installationId,
    });

    const integration = await this.githubIntegrationWriteService.create({
      cryptlyProjectId: projectId,
      githubRepositoryId: repositoryId,
      repositoryPublicKey: publicKey.key,
      repositoryPublicKeyId: publicKey.keyId,
    });

    return GithubIntegrationSerializer.serialize(integration);
  }

  public async getProjectIntegrations(projectId: string): Promise<GetGithubIntegrationsDto[]> {
    const project = await this.projectReadService.findById(projectId);
    const installationId = project.integrations.githubInstallationId;

    if (!installationId) {
      return [];
    }

    const integrations = await this.githubIntegrationReadService.findByProjectId(projectId);
    if (!integrations.length) {
      return [];
    }

    return Promise.all(
      integrations.map(async (integration) => {
        const repo = await this.client.getRepositoryById({
          repositoryId: integration.githubRepositoryId,
          installationId,
        });

        return {
          projectId,
          name: repo.name,
          owner: repo.owner,
          repositoryId: repo.id,
          fullName: repo.fullName,
          publicKey: integration.repositoryPublicKey,
          publicKeyId: integration.repositoryPublicKeyId,
        } satisfies GetGithubIntegrationsDto;
      }),
    );
  }

  public async getInstallationById(installationId: number): Promise<GithubInstallationResponseDto> {
    return this.client.getInstallationById(installationId);
  }

  public async getAccessibleRepositories(
    installationId: number,
  ): Promise<AccessibleRepositoryDto[]> {
    return this.client.getAccessibleRepositories(installationId);
  }

  public async upsertSecrets(
    projectId: string,
    { repositoryId }: UpdateSecretsBodyDto,
  ): Promise<void> {
    const [project, integration] = await Promise.all([
      this.projectReadService.findById(projectId),
      this.githubIntegrationReadService.findByRepositoryId(repositoryId),
    ]);
    const integration2 = integration as GithubIntegrationNormalized; // todo: fix types

    if (!project.integrations.githubInstallationId) {
      this.logger.error('Cannot import secrets to project which has not installed the app', {
        projectId,
      });
      throw new BadRequestException('Invalid project selected');
    }

    const repository = await this.client.getRepositoryById({
      repositoryId,
      installationId: project.integrations.githubInstallationId,
    });

    const { failedSecrets } = await this.client.upsertSecrets({
      secrets: project.encryptedSecretsKeys, // todo: ensure that encrypted via libsodium
      keyId: integration2.repositoryPublicKeyId,
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
