import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubClient, GithubInstallationResponseDto } from 'src/integration/github/github.client';
import { GithubIntegrationWriteService } from 'src/integration/github/write/github-integration-write.service';
import { GithubIntegrationReadService } from 'src/integration/github/read/github-integration-read.service';
import { Logger } from '@logdash/js-sdk';
import { AccessibleRepositoryDto } from 'src/integration/github/dto/get-accessible-repositories.dto';
import { ProjectReadService } from 'src/project/read/project-read.service';
import { GithubIntegrationSerializer } from 'src/integration/github/entities/github-integration.serializer';
import { GithubIntegrationSerialized } from 'src/integration/github/entities/github-integration.interface';
import { CreateGithubIntegrationDto } from 'src/integration/github/dto/create-github-integration.dto';
import { GetGithubIntegrationsDto } from 'src/integration/github/dto/get-github-integrations.dto';
import { UpdateSecretsBodyDto } from 'src/integration/github/dto/update-secrets.dto';
import { ProjectWriteService } from 'src/project/write/project-write.service';
import { GetGithubInstallationDto } from 'src/integration/github/dto/get-github-installation.dto';

@Injectable()
export class GithubIntegrationService {
  public constructor(
    private readonly client: GithubClient,
    private readonly logger: Logger,
    private readonly githubIntegrationWriteService: GithubIntegrationWriteService,
    private readonly githubIntegrationReadService: GithubIntegrationReadService,
    private readonly projectReadService: ProjectReadService,
    private readonly projectWriteService: ProjectWriteService,
  ) {}

  public async createAccessToken() {
    return this.client.createAccessToken();
  }

  public async createIntegration({
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

  public async getInstallationById(installationId: number): Promise<GetGithubInstallationDto> {
    const installation = await this.client.getInstallationById(installationId);

    return {
      id: installationId,
      ...installation,
    };
  }

  public async deleteInstallation(projectId: string): Promise<void> {
    const project = await this.projectReadService.findById(projectId);
    const installationId = project.integrations.githubInstallationId;

    if (!installationId) {
      this.logger.error('Project has no installation', { projectId });
      throw new BadRequestException('Project has no installation');
    }

    await Promise.all([
      this.githubIntegrationWriteService.deleteByProjectId(projectId),
      this.projectWriteService.update(projectId, { githubInstallationId: null }, ''),
      this.client.deleteInstallation(installationId),
    ]);
  }

  public async deleteIntegration(integrationId: string): Promise<void> {
    await this.githubIntegrationWriteService.deleteById(integrationId);
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
