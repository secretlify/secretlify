import { Body, ConflictException, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GithubRepositorySerialized } from '../client/dto/github-repository.dto';
import { GithubIntegrationClient } from '../client/github-integration-client.service';
import { CurrentUserId } from 'src/auth/core/decorators/current-user-id.decorator';
import { GithubInstallationWriteService } from '../write/github-installation-write.service';
import { GithubInstallationReadService } from '../read/github-installation-read.service';
import { CreateGithubInstallationBody } from './dto/create-github-installation.body';
import { GithubInstallationSerializer } from './entities/github-installation.serializer';
import { GithubInstallationSerialized } from './entities/github-installation.interface';
import { CreateGithubIntegrationBody } from './dto/create-github-integration.body';
import { GithubIntegrationSerialized } from './entities/github-integration.interface';
import { GithubIntegrationReadService } from '../read/github-integration-read.service';
import { GithubIntegrationWriteService } from '../write/github-integration-write.service';
import { GithubIntegrationSerializer } from './entities/github-integration.serializer';
import { TokenResponse } from 'src/shared/responses/token.response';

@Controller('')
@ApiTags('Github external connections')
@ApiBearerAuth()
export class GithubExternalConnectionCoreController {
  constructor(
    private readonly client: GithubIntegrationClient,
    private readonly installationWriteService: GithubInstallationWriteService,
    private readonly installationReadService: GithubInstallationReadService,
    private readonly integrationReadService: GithubIntegrationReadService,
    private readonly integrationWriteService: GithubIntegrationWriteService,
  ) {}

  @ApiResponse({ type: GithubRepositorySerialized, isArray: true })
  @Get('/external-connections/github/installations/:installationEntityId/repositories')
  public async getRepositoriesAvailableForInstallation(
    @Param('installationEntityId') installationEntityId: string,
  ): Promise<GithubRepositorySerialized[]> {
    const installation = await this.installationReadService.findById(installationEntityId);

    return this.client.getRepositoriesAvailableForInstallation(installation.githubInstallationId);
  }

  @Get('/external-connections/github/installations/:installationEntityId')
  public async getInstallationById(
    @Param('installationEntityId') installationEntityId: string,
  ): Promise<GithubInstallationSerialized> {
    const installation = await this.installationReadService.findById(installationEntityId);

    const liveData = await this.client.getInstallationByGithubInstallationId(
      installation.githubInstallationId,
    );

    return GithubInstallationSerializer.serialize(installation, {
      liveData,
    });
  }

  @ApiResponse({ type: GithubInstallationSerialized })
  @Post('users/me/external-connections/github/installations')
  public async createInstallation(
    @CurrentUserId() currentUserId: string,
    @Body() dto: CreateGithubInstallationBody,
  ): Promise<GithubInstallationSerialized> {
    const existingInstallation = await this.installationReadService.findByGithubInstallationId(
      dto.githubInstallationId,
    );

    if (existingInstallation) {
      throw new ConflictException('Installation with that gitbubInstallationId already exists');
    }

    const created = await this.installationWriteService.create({
      githubInstallationId: dto.githubInstallationId,
      userId: currentUserId,
    });

    return GithubInstallationSerializer.serialize(created);
  }

  @ApiResponse({ type: GithubInstallationSerialized, isArray: true })
  @Get('users/me/external-connections/github/installations')
  public async getCurrentUserInstallations(
    @CurrentUserId() currentUserId: string,
  ): Promise<GithubInstallationSerialized[]> {
    const installations = await this.installationReadService.findByUserId(currentUserId);

    return installations.map((inst) => GithubInstallationSerializer.serialize(inst));
  }

  @ApiResponse({ type: GithubIntegrationSerialized })
  @Post('/external-connections/github/installations')
  public async createIntegration(
    @Body() body: CreateGithubIntegrationBody,
  ): Promise<GithubIntegrationSerialized> {
    const existingIntegration =
      await this.integrationReadService.findByProjectIdAndInstallationEntityId({
        projectId: body.projectId,
        installationEntityId: body.installationEntityId,
      });

    if (existingIntegration) {
      throw new Error('Integration between this installation and project already exists');
    }

    const installation = await this.installationReadService.findById(body.installationEntityId);

    const repositoryInfo = await this.client.getRepositoryInfoByInstallationIdAndRepositoryId({
      repositoryId: body.repositoryId,
      githubInstallationId: installation.githubInstallationId,
    });

    const githubRepositoryKey = await this.client.getRepositoryPublicKey({
      owner: repositoryInfo.owner,
      repositoryName: repositoryInfo.name,
      githubInstallationId: installation.githubInstallationId,
    });

    const integration = await this.integrationWriteService.create({
      cryptlyProjectId: body.projectId,
      githubRepositoryId: body.repositoryId,
      repositoryPublicKey: githubRepositoryKey.key,
      repositoryPublicKeyId: githubRepositoryKey.keyId,
    });

    return GithubIntegrationSerializer.serialize(integration);
  }

  @ApiResponse({ type: GithubIntegrationSerialized, isArray: true })
  @Get('/projects/:projectId/integrations/github')
  public async getProjectIntegrations(
    @Param('projectId') projectId: string,
  ): Promise<GithubIntegrationSerialized[]> {
    const integrations = await this.integrationReadService.findByProjectId(projectId);

    return integrations.map(GithubIntegrationSerializer.serialize);
  }

  @ApiResponse({ type: TokenResponse })
  @Get('/external-connections/github/installations/:installationEntityId')
  public async getInstallationAccessToken(
    @Param('installationEntityId') installationEntityId: string,
  ): Promise<any> {
    const installation = await this.installationReadService.findById(installationEntityId);

    const token = await this.client.getInstallationAccessToken(installation.githubInstallationId);

    return {
      token,
    };
  }

  //   @Delete('/projects/:projectId/integrations/github/installations')
  //   @UseGuards(ProjectAdminGuard)
  //   public async deleteInstallation(@Param('projectId') projectId: string): Promise<void> {
  //     await this.githubIntegrationService.deleteInstallation(projectId);
  //   }

  //   @Delete('integrations/github/:integrationId')
  //   public async deleteIntegration(@Param('integrationId') integrationId: string): Promise<void> {
  //     await this.githubIntegrationService.deleteIntegration(integrationId);
  //   }
}
