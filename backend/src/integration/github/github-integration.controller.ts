import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessibleRepositoryDto } from 'src/integration/github/dto/get-accessible-repositories.dto';
import { GithubIntegrationService } from 'src/integration/github/github-integration.service';
import { CreateAccessTokenResponseDto } from 'src/integration/github/dto/create-access-token.dto';
import { CreateGithubIntegrationDto } from 'src/integration/github/dto/create-github-integration.dto';
import { GithubIntegrationSerialized } from 'src/integration/github/entities/github-integration.interface';
import { GetGithubIntegrationsDto } from 'src/integration/github/dto/get-github-integrations.dto';

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
  ): Promise<GithubIntegrationSerialized> {
    return this.githubIntegrationService.getInstallationById(installationId);
  }

  @Post('/integrations/github')
  public async createInstallation(
    @Body() body: CreateGithubIntegrationDto,
  ): Promise<GithubIntegrationSerialized> {
    return this.githubIntegrationService.create(body);
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

  // todo: probably should be a route in integration/project controller
  @Put('/:projectId/import')
  @HttpCode(204)
  public async importSecrets(@Param('projectId') projectId: string): Promise<void> {
    await this.githubIntegrationService.upsertSecrets(projectId);
  }
}
