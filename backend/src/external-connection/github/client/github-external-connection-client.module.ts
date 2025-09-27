import { Module } from '@nestjs/common';
import { GithubExternalConnectionClientService } from './github-external-connection-client.service';
import { getEnvConfig } from 'src/shared/config/env-config';
import { App } from 'octokit';

const githubConfig = getEnvConfig().github;

export const GITHUB_CRYPTLY_APP = Symbol.for('GITHUB_CRYPTLY_APP');

@Module({
  providers: [GithubExternalConnectionClientService],
  exports: [GithubExternalConnectionClientService],
})
export class GithubExternalConnectionClientModule {}
