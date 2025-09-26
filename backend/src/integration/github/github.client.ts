import { Logger } from '@logdash/js-sdk';
import { Inject, Injectable } from '@nestjs/common';
import {
  GITHUB_CONFIG,
  GITHUB_CRYPTLY_APP,
} from 'src/integration/github/github-integration.constants';
import { Endpoints, OctokitResponse } from '@octokit/types';
import { EnvConfig } from 'src/shared/config/env-config';
import { App } from 'octokit';
import { Octokit } from 'src/shared/types/octokit';

type GithubInstallation = Endpoints['GET /app/installations/{installation_id}']['response']['data'];
type GithubRepository = Endpoints['GET /repos/{owner}/{repo}']['response']['data'];
type CreateAccessToken =
  Endpoints['POST /app/installations/{installation_id}/access_tokens']['response']['data'];
type RepositoryPublicKey =
  Endpoints['GET /repos/{owner}/{repo}/actions/secrets/public-key']['response']['data'];

export type GithubRepoDto = {
  id: number;
  fullName: string;
  owner: string;
  avatarUrl: string;
  name: string;
  url: string;
  isPrivate: boolean;
};

export type RepoPublicKeyResponseDto = {
  keyId: string;
  key: string;
};

export type GithubInstallationResponseDto = {
  id: number;
  owner: string;
  avatar: string;
  installationId: number;
};

export type AccessTokenResponseDto = {
  token: string;
  expiresAt: string;
};

@Injectable()
export class GithubClient {
  public constructor(
    private readonly logger: Logger,
    @Inject(GITHUB_CRYPTLY_APP) private readonly githubApp: App,
    @Inject(GITHUB_CONFIG) private readonly githubConfig: EnvConfig['github'],
  ) {}

  private async getInstallationOctokit(installationId: number): Promise<Octokit> {
    return this.githubApp.getInstallationOctokit(installationId);
  }

  public async getInstallationById(installationId: number): Promise<GithubInstallationResponseDto> {
    const response: OctokitResponse<GithubInstallation> = await this.githubApp.octokit.request(
      'GET /app/installations/{installation_id}',
      { installation_id: installationId },
    );

    const account = response.data.account || { avatar_url: '', login: '' };

    return {
      id: installationId,
      avatar: account?.avatar_url || '',
      owner: 'login' in account ? account.login : account?.name || '',
      installationId,
    };
  }

  public async deleteInstallation(installationId: number): Promise<void> {
    await this.githubApp.octokit.request('DELETE /app/installations/{installation_id}', {
      installation_id: installationId,
    });
  }

  public async getAccessibleRepositories(installationId: number): Promise<GithubRepoDto[]> {
    const octokit = await this.getInstallationOctokit(installationId);
    const repositories = await octokit.paginate('GET /installation/repositories', {
      per_page: 100,
    });

    return repositories.map((repo) => this.mapRepository(repo));
  }

  public async getRepositoryById(params: {
    repositoryId: number;
    installationId: number;
  }): Promise<GithubRepoDto> {
    const octokit = await this.getInstallationOctokit(params.installationId);
    const response: OctokitResponse<GithubRepository> = await octokit.request(
      'GET /repositories/{repositoryId}',
      { repositoryId: params.repositoryId },
    );

    return this.mapRepository(response.data);
  }

  public async createAccessToken(installationId: number): Promise<AccessTokenResponseDto> {
    const response: OctokitResponse<CreateAccessToken> = await this.githubApp.octokit.request(
      'POST /app/installations/{installation_id}/access_tokens',
      { installation_id: installationId },
    );

    return {
      token: response.data.token,
      expiresAt: response.data.expires_at,
    };
  }

  public async getRepositoryPublicKey(params: {
    owner: string;
    installationId: number;
    repositoryName: string;
  }): Promise<RepoPublicKeyResponseDto> {
    const octokit = await this.getInstallationOctokit(params.installationId);
    const response: OctokitResponse<RepositoryPublicKey> = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/secrets/public-key',
      { owner: params.owner, repo: params.repositoryName },
    );

    return {
      keyId: response.data.key_id,
      key: response.data.key,
    };
  }

  private mapRepository(
    dto: Pick<GithubRepository, 'name' | 'id' | 'owner' | 'url' | 'private' | 'full_name'>,
  ): GithubRepoDto {
    return {
      id: dto.id,
      name: dto.name,
      owner: dto.owner.login,
      avatarUrl: dto.owner.avatar_url,
      fullName: dto.full_name,
      url: dto.url,
      isPrivate: dto.private,
    };
  }
}
