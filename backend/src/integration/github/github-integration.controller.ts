import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessibleRepositoryDto } from 'src/integration/github/dto/get-accessible-repositories.dto';
import { GithubIntegrationService } from 'src/integration/github/github-integration.service';
import { CreateAccessTokenResponseDto } from 'src/integration/github/dto/create-access-token.dto';
import { CreateGithubIntegrationDto } from 'src/integration/github/dto/create-github-integration.dto';
import { GithubIntegrationSerialized } from 'src/integration/github/entities/github-integration.interface';
import { GetGithubIntegrationsDto } from 'src/integration/github/dto/get-github-integrations.dto';
import { GetGithubInstallationDto } from 'src/integration/github/dto/get-github-installation.dto';
import { UpdateSecretsBodyDto } from 'src/integration/github/dto/update-secrets.dto';

@Controller('')
@ApiTags('Github')
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

  @Get('/projects/:projectId/integrations/github')
  public async getProjectIntegrations(
    @Param('projectId') projectId: string,
  ): Promise<GetGithubIntegrationsDto[]> {
    return this.githubIntegrationService.getProjectIntegrations(projectId);
  }

  // todo: should I pass installationId in the request or use the organisation one
  @Post('/access-token')
  @ApiResponse({ type: CreateAccessTokenResponseDto })
  public async createAccessToken(): Promise<CreateAccessTokenResponseDto> {
    return this.githubIntegrationService.createAccessToken();
  }

  @Put('/projects/:projectId/integrations/github/repositories/:repositoryId/secrets')
  @HttpCode(204)
  public async importSecrets(
    @Param('projectId') projectId: string,
    @Body() body: UpdateSecretsBodyDto,
  ): Promise<void> {
    await this.githubIntegrationService.upsertSecrets(projectId, body);
  }
}
