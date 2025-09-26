import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubClient } from 'src/integration/github/github.client';
import { GithubIntegrationWriteService } from 'src/integration/github/write/github-integration-write.service';
import { GithubIntegrationReadService } from 'src/integration/github/read/github-integration-read.service';
import { Logger } from '@logdash/js-sdk';
import { AccessibleRepositoryDto } from 'src/integration/github/dto/get-accessible-repositories.dto';
import { ProjectReadService } from 'src/project/read/project-read.service';
import { GithubIntegrationSerializer } from 'src/integration/github/entities/github-integration.serializer';
import { GithubIntegrationSerialized } from 'src/integration/github/entities/github-integration.interface';
import { CreateGithubIntegrationDto } from 'src/integration/github/dto/create-github-integration.dto';
import { GetGithubIntegrationsDto } from 'src/integration/github/dto/get-github-integrations.dto';
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

  public async createAccessToken(installationId: number) {
    return this.client.createAccessToken(installationId);
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
    return this.client.getInstallationById(installationId);
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
}
