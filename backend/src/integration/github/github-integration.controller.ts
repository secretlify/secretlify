import { Controller, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AccessibleRepositoryDto,
  GetAccessibleRepositoriesQueryDto,
} from 'src/integration/github/dto/get-accessible-repositories.dto';
import { GithubIntegrationService } from 'src/integration/github/github-integration.service';
import { CreateAccessTokenResponseDto } from 'src/integration/github/dto/create-access-token.dto';

@Controller('/integrations/github')
@ApiTags('Github')
@ApiBearerAuth()
export class GithubIntegrationController {
  public constructor(private readonly githubIntegrationService: GithubIntegrationService) {}

  @Get(`/installations/:installationId/repositories`)
  public async getAvailableRepos(
    @Param('installationId') installationId: number,
  ): Promise<AccessibleRepositoryDto[]> {
    return this.githubIntegrationService.getAccessibleRepositories(installationId);
  }

  @Post('/test')
  public async test(): Promise<any> {
    return this.githubIntegrationService.test();
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
