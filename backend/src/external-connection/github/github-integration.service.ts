import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubIntegrationClient } from 'src/external-connection/github/client/github-integration-client.service';
import { GithubIntegrationWriteService } from 'src/external-connection/github/write/github-integration-write.service';
import { GithubIntegrationReadService } from 'src/external-connection/github/read/github-integration-read.service';
import { Logger } from '@logdash/js-sdk';
import { GithubRepositorySerialized } from 'src/integration/github/core/dto/get-accessible-repositories.dto';
import { ProjectReadService } from 'src/project/read/project-read.service';
import { GithubIntegrationSerializer } from 'src/integration/github/entities/github-integration.serializer';
import { GithubIntegrationSerialized } from 'src/integration/github/entities/github-integration.interface';
import { CreateGithubIntegrationBody } from 'src/external-connection/github/core/dto/create-github-integration.body';
import { GetGithubIntegrationsDto } from 'src/external-connection/github/core/dto/get-github-integrations.dto';
import { ProjectWriteService } from 'src/project/write/project-write.service';
import { GetGithubInstallationDto } from 'src/external-connection/github/core/dto/get-github-installation.dto';

@Injectable()
export class GithubIntegrationService {
  public constructor(
    private readonly client: GithubIntegrationClient,
    private readonly logger: Logger,
    private readonly githubIntegrationWriteService: GithubIntegrationWriteService,
    private readonly githubIntegrationReadService: GithubIntegrationReadService,
    private readonly projectReadService: ProjectReadService,
    private readonly projectWriteService: ProjectWriteService,
  ) {}

  public async createAccessToken(installationId: number) {
    return this.client.getInstallationAccessToken(installationId);
  }

  public async createIntegration({
    projectId,
    repositoryId,
    installationId,
  }: CreateGithubIntegrationBody): Promise<GithubIntegrationSerialized> {
    const repository = await this.client.getRepositoryInfoByInstallationIdAndRepositoryId({
      repositoryId,
      githubInstallationId: installationId,
    });

    const publicKey = await this.client.getRepositoryPublicKey({
      repositoryName: repository.name,
      owner: repository.owner,
      githubInstallationId: installationId,
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
        const repo = await this.client.getRepositoryInfoByInstallationIdAndRepositoryId({
          repositoryId: integration.githubRepositoryId,
          githubInstallationId: installationId,
        });

        return {
          id: integration.id,
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
    return this.client.getInstallationByGithubInstallationId(installationId);
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
  ): Promise<GithubRepositorySerialized[]> {
    return this.client.getRepositoriesAvailableForInstallation(installationId);
  }
}
