import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessibleRepositoryDto } from 'src/integration/github/dto/get-accessible-repositories.dto';
import { GithubIntegrationService } from 'src/integration/github/github-integration.service';
import {
  CreateAccessTokenBodyDto,
  CreateAccessTokenResponseDto,
} from 'src/integration/github/dto/create-access-token.dto';
import { CreateGithubIntegrationDto } from 'src/integration/github/dto/create-github-integration.dto';
import { GithubIntegrationSerialized } from 'src/integration/github/entities/github-integration.interface';
import { GetGithubIntegrationsDto } from 'src/integration/github/dto/get-github-integrations.dto';
import { GetGithubInstallationDto } from 'src/integration/github/dto/get-github-installation.dto';

@Controller('')
@ApiTags('Github Integration')
@ApiBearerAuth()
export class GithubIntegrationController {
  public constructor(private readonly githubIntegrationService: GithubIntegrationService) {}

  @Get('/integrations/github/installations/:installationId/repositories')
  public async getAvailableRepos(
    @Param('installationId') installationId: number,
  ): Promise<AccessibleRepositoryDto[]> {
    return this.githubIntegrationService.getAccessibleRepositories(installationId);
  }

  @Get('/integrations/github/installations/:installationId')
  public async getInstallationById(
    @Param('installationId') installationId: number,
  ): Promise<GetGithubInstallationDto> {
    return this.githubIntegrationService.getInstallationById(installationId);
  }

  @Post('/integrations/github')
  public async createIntegration(
    @Body() body: CreateGithubIntegrationDto,
  ): Promise<GithubIntegrationSerialized> {
    return this.githubIntegrationService.createIntegration(body);
  }

  @Delete('/projects/:projectId/integrations/github/installations')
  @HttpCode(204)
  public async deleteInstallation(@Param('projectId') projectId: string): Promise<void> {
    await this.githubIntegrationService.deleteInstallation(projectId);
  }

  @Delete('integrations/github/:integrationId')
  @HttpCode(204)
  public async deleteIntegration(@Param('integrationId') integrationId: string): Promise<void> {
    await this.githubIntegrationService.deleteIntegration(integrationId);
  }

  @Get('/projects/:projectId/integrations/github')
  public async getProjectIntegrations(
    @Param('projectId') projectId: string,
  ): Promise<GetGithubIntegrationsDto[]> {
    return this.githubIntegrationService.getProjectIntegrations(projectId);
  }

  @Post('/integrations/github/access-token')
  public async createAccessToken(
    @Body() body: CreateAccessTokenBodyDto,
  ): Promise<CreateAccessTokenResponseDto> {
    return this.githubIntegrationService.createAccessToken(body.installationId);
  }
}
