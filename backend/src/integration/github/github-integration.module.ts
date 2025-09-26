import { Module } from '@nestjs/common';
import { GithubIntegrationService } from './github-integration.service';
import { GithubClient } from 'src/integration/github/github.client';
import { GithubIntegrationController } from 'src/integration/github/github-integration.controller';
import { GithubIntegrationReadModule } from 'src/integration/github/read/github-integration-read.module';
import { GithubIntegrationWriteModule } from 'src/integration/github/write/github-integration-write.module';
import { App } from 'octokit';

import {
  GITHUB_CONFIG,
  GITHUB_CRYPTLY_APP,
} from 'src/integration/github/github-integration.constants';
import { getEnvConfig } from 'src/shared/config/env-config';
import { ProjectReadModule } from 'src/project/read/project-read.module';
import { ProjectWriteModule } from 'src/project/write/project-write.module';

const githubConfig = getEnvConfig().github;

@Module({
  imports: [
    GithubIntegrationReadModule,
    GithubIntegrationWriteModule,
    ProjectReadModule,
    ProjectWriteModule,
  ],
  controllers: [GithubIntegrationController],
  providers: [
    GithubIntegrationService,
    GithubClient,
    {
      provide: GITHUB_CRYPTLY_APP,
      useValue: new App({
        appId: githubConfig.app.id,
        privateKey: githubConfig.app.privateKey,
      }),
    },
    {
      provide: GITHUB_CONFIG,
      useValue: githubConfig,
    },
  ],
  exports: [GithubIntegrationService],
})
export class GithubIntegrationModule {}
