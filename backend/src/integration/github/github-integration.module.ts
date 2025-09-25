import { Module } from '@nestjs/common';
import { GithubIntegrationService } from './github-integration.service';
import { GithubClient } from 'src/integration/github/github.client';
import { GithubIntegrationController } from 'src/integration/github/github-integration.controller';
import { EncryptionModule } from 'src/shared/encryption/encryption.module';
import { GithubIntegrationReadModule } from 'src/integration/github/read/github-integration-read.module';
import { GithubIntegrationWriteModule } from 'src/integration/github/write/github-integration-write.module';
import { App, Octokit } from 'octokit';

import { GithubCryptlyApp } from 'src/shared/constants/symbol';
import { getEnvConfig } from 'src/shared/config/env-config';
import { ProjectReadModule } from 'src/project/read/project-read.module';

@Module({
  imports: [
    EncryptionModule,
    GithubIntegrationReadModule,
    GithubIntegrationWriteModule,
    ProjectReadModule,
  ],
  controllers: [GithubIntegrationController],
  providers: [
    GithubIntegrationService,
    GithubClient,
    {
      provide: GithubCryptlyApp,
      useFactory: () => {
        const config = getEnvConfig().github;

        return new App({
          appId: config.app.id,
          privateKey: config.app.privateKey,
          Octokit: Octokit.defaults({ baseUrl: config.api.baseUrl }),
        });
      },
    },
  ],
  exports: [GithubIntegrationService],
})
export class GithubIntegrationModule {}
