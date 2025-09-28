import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GithubRepositorySerialized } from '../client/dto/github-repository.dto';
import { GithubExternalConnectionClientService } from '../client/github-external-connection-client.service';
import { CurrentUserId } from '../../../auth/core/decorators/current-user-id.decorator';
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
import { TokenResponse } from '../../../shared/responses/token.response';
import { ProjectReadService } from '../../../project/read/project-read.service';
import { Role } from '../../../shared/types/role.enum';
import { ProjectMemberGuard } from '../../../project/core/guards/project-member.guard';

@Controller('')
@ApiTags('Github external connections')
@ApiBearerAuth()
export class GithubExternalConnectionCoreController {
  constructor(
    private readonly client: GithubExternalConnectionClientService,
    private readonly installationWriteService: GithubInstallationWriteService,
    private readonly installationReadService: GithubInstallationReadService,
    private readonly integrationReadService: GithubIntegrationReadService,
    private readonly integrationWriteService: GithubIntegrationWriteService,
    private readonly projectReadService: ProjectReadService,
  ) {}

  @ApiResponse({ type: GithubRepositorySerialized, isArray: true })
  @Get('/external-connections/github/installations/:installationEntityId/repositories')
  public async getRepositoriesAvailableForInstallation(
    @Param('installationEntityId') installationEntityId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<GithubRepositorySerialized[]> {
    const installation = await this.installationReadService.findById(installationEntityId);

    if (installation.userId !== currentUserId) {
      throw new ForbiddenException('You are not the owner of this installation');
    }

    return this.client.getRepositoriesAvailableForInstallation(installation.githubInstallationId);
  }

  @Get('/external-connections/github/installations/:installationEntityId')
  public async getInstallationById(
    @Param('installationEntityId') installationEntityId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<GithubInstallationSerialized> {
    const installation = await this.installationReadService.findById(installationEntityId);

    if (installation.userId !== currentUserId) {
      throw new ForbiddenException('You are not the owner of this installation');
    }

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

    const ghInstallations = await Promise.all(
      installations.map(async (inst) => {
        return this.client.getInstallationByGithubInstallationId(inst.githubInstallationId);
      }),
    );

    return installations.map((inst) =>
      GithubInstallationSerializer.serialize(inst, {
        liveData: ghInstallations.find((ghInst) => ghInst.id === inst.githubInstallationId),
      }),
    );
  }

  @ApiResponse({ type: GithubIntegrationSerialized })
  @Post('/external-connections/github/integrations')
  public async createIntegration(
    @Body() body: CreateGithubIntegrationBody,
    @CurrentUserId() currentUserId: string,
  ): Promise<GithubIntegrationSerialized> {
    const project = await this.projectReadService.findById(body.projectId);

    const role = project.members.get(currentUserId);

    if (!role) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (role !== Role.Owner && role !== Role.Admin) {
      throw new ForbiddenException('You are not the owner or admin of this project');
    }

    const existingIntegration = await this.integrationReadService.findByProjectIdAndRepositoryId({
      projectId: body.projectId,
      githubRepositoryId: body.repositoryId,
    });

    if (existingIntegration) {
      throw new ConflictException(
        'Integration between this installation and project already exists',
      );
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
      projectId: body.projectId,
      githubRepositoryId: body.repositoryId,
      repositoryPublicKey: githubRepositoryKey.key,
      repositoryPublicKeyId: githubRepositoryKey.keyId,
      installationEntityId: body.installationEntityId,
    });

    return GithubIntegrationSerializer.serialize(integration);
  }

  @ApiResponse({ type: GithubIntegrationSerialized, isArray: true })
  @Get('/projects/:projectId/external-connections/github/integrations')
  @UseGuards(ProjectMemberGuard)
  public async getProjectIntegrations(
    @Param('projectId') projectId: string,
  ): Promise<GithubIntegrationSerialized[]> {
    const integrations = await this.integrationReadService.findByProjectId(projectId);

    const installations = await Promise.all(
      integrations.map(async (integration) => {
        return this.installationReadService.findById(integration.installationEntityId);
      }),
    );

    const ghRepositoriesInfo = await Promise.all(
      integrations.map(async (integration) => {
        return this.client.getRepositoryInfoByInstallationIdAndRepositoryId({
          repositoryId: integration.githubRepositoryId,
          githubInstallationId: installations.find(
            (installation) => installation.id === integration.installationEntityId,
          )?.githubInstallationId!,
        });
      }),
    );

    return integrations.map((integration) =>
      GithubIntegrationSerializer.serialize(integration, {
        repositoryData: ghRepositoriesInfo.find(
          (repository) => repository.id === integration.githubRepositoryId,
        ),
      }),
    );
  }

  @ApiResponse({ type: TokenResponse })
  @Get('/external-connections/github/installations/:installationEntityId/access-token')
  public async getInstallationAccessToken(
    @Param('installationEntityId') installationEntityId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<any> {
    const installation = await this.installationReadService.findById(installationEntityId);

    if (installation.userId !== currentUserId) {
      throw new ForbiddenException('You are not the owner of this installation');
    }

    const token = await this.client.getInstallationAccessToken(installation.githubInstallationId);

    return {
      token,
    };
  }

  @Delete('external-connections/github/integrations/:integrationId')
  public async deleteIntegration(
    @Param('integrationId') integrationId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<void> {
    const integration = await this.integrationReadService.findById(integrationId);

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    const project = await this.projectReadService.findById(integration.projectId);

    const role = project.members.get(currentUserId);

    if (!role) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (role !== Role.Owner && role !== Role.Admin) {
      throw new ForbiddenException('You are not the owner or admin of this project');
    }

    await this.integrationWriteService.deleteById(integrationId);
  }
}
