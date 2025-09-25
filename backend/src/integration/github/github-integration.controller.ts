import { Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AccessibleRepositoryDto,
  GetAccessibleRepositoriesQueryDto,
} from 'src/integration/github/dto/get-accessible-repositories.dto';
import { GithubIntegrationService } from 'src/integration/github/github-integration.service';

@Controller('github')
@ApiTags('Github')
@ApiBearerAuth()
export class GithubIntegrationController {
  public constructor(private readonly githubIntegrationService: GithubIntegrationService) {}

  @Get('/repositories')
  public async getAvailableRepos(
    @Query() { name }: GetAccessibleRepositoriesQueryDto,
  ): Promise<AccessibleRepositoryDto[]> {
    return this.githubIntegrationService.getAccessibleRepositories(name);
  }

  @Post('/test')
  public async test(): Promise<any> {
    return this.githubIntegrationService.test();
  }

  // todo: probably should be a route in integration/project controller
  @Put('/:projectId/import')
  @HttpCode(204)
  public async importSecrets(@Param('projectId') projectId: string): Promise<void> {
    await this.githubIntegrationService.upsertSecrets(projectId);
  }
}
