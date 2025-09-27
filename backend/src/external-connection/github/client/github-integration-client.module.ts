import { Module } from '@nestjs/common';
import { GithubIntegrationClient } from './github-integration-client.service';
import { GITHUB_CRYPTLY_APP } from '../github-integration.constants';
import { getEnvConfig } from 'src/shared/config/env-config';
import { App } from 'octokit';

const githubConfig = getEnvConfig().github;

@Module({
  providers: [
    GithubIntegrationClient,
    {
      provide: GITHUB_CRYPTLY_APP,
      useValue: new App({
        appId: githubConfig.app.id,
        privateKey: githubConfig.app.privateKey,
      }),
    },
  ],
})
export class GithubIntegrationClientModule {}
