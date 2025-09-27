import { Injectable } from '@nestjs/common';
import { Endpoints, OctokitResponse } from '@octokit/types';
import { App } from 'octokit';
import { Octokit } from 'src/shared/types/octokit';
import { GithubRepository } from './dto/github-repository.dto';
import { GithubInstallationLiveData } from './dto/github-installation.dto';
import { getEnvConfig } from 'src/shared/config/env-config';

type OctokitGithubInstallation =
  Endpoints['GET /app/installations/{installation_id}']['response']['data'];
type OctokitGithubRepository = Endpoints['GET /repos/{owner}/{repo}']['response']['data'];
type CreateAccessToken =
  Endpoints['POST /app/installations/{installation_id}/access_tokens']['response']['data'];
type RepositoryPublicKey =
  Endpoints['GET /repos/{owner}/{repo}/actions/secrets/public-key']['response']['data'];

export type GithubRepositoryKey = {
  keyId: string;
  key: string;
};

export type AccessTokenResponseDto = {
  token: string;
  expiresAt: string;
};

@Injectable()
export class GithubExternalConnectionClientService {
  private githubApp = new App({
    appId: getEnvConfig().github.app.id,
    privateKey: getEnvConfig().github.app.privateKey,
  });

  private async getInstallationOctokit(installationId: number): Promise<Octokit> {
    return this.githubApp.getInstallationOctokit(installationId);
  }

  public async getRepositoriesAvailableForInstallation(
    installationId: number,
  ): Promise<GithubRepository[]> {
    const octokit = await this.getInstallationOctokit(installationId);
    const repositories = await octokit.paginate('GET /installation/repositories', {
      per_page: 100,
    });

    return repositories.map((repo) => this.mapOctokitGithubRepository(repo));
  }

  public async getInstallationByGithubInstallationId(
    installationId: number,
  ): Promise<GithubInstallationLiveData> {
    const response: OctokitResponse<OctokitGithubInstallation> =
      await this.githubApp.octokit.request('GET /app/installations/{installation_id}', {
        installation_id: installationId,
      });

    const account = response.data.account || { avatar_url: '', login: '' };

    return {
      id: installationId,
      avatar: account?.avatar_url || '',
      owner: 'login' in account ? account.login : account?.name || '',
    };
  }

  public async deleteInstallation(installationId: number): Promise<void> {
    await this.githubApp.octokit.request('DELETE /app/installations/{installation_id}', {
      installation_id: installationId,
    });
  }

  public async getRepositoryInfoByInstallationIdAndRepositoryId(params: {
    repositoryId: number;
    githubInstallationId: number;
  }): Promise<GithubRepository> {
    const octokit = await this.getInstallationOctokit(params.githubInstallationId);
    const response: OctokitResponse<OctokitGithubRepository> = await octokit.request(
      'GET /repositories/{repositoryId}',
      { repositoryId: params.repositoryId },
    );

    return this.mapOctokitGithubRepository(response.data);
  }

  public async getInstallationAccessToken(installationId: number): Promise<string> {
    const response: OctokitResponse<CreateAccessToken> = await this.githubApp.octokit.request(
      'POST /app/installations/{installation_id}/access_tokens',
      { installation_id: installationId },
    );

    return response.data.token;
  }

  public async getRepositoryPublicKey(params: {
    owner: string;
    githubInstallationId: number;
    repositoryName: string;
  }): Promise<GithubRepositoryKey> {
    const octokit = await this.getInstallationOctokit(params.githubInstallationId);
    const response: OctokitResponse<RepositoryPublicKey> = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/secrets/public-key',
      { owner: params.owner, repo: params.repositoryName },
    );

    return {
      keyId: response.data.key_id,
      key: response.data.key,
    };
  }

  private mapOctokitGithubRepository(
    dto: Pick<OctokitGithubRepository, 'name' | 'id' | 'owner' | 'url' | 'private' | 'full_name'>,
  ): GithubRepository {
    return {
      id: dto.id,
      name: dto.name,
      owner: dto.owner.login,
      avatarUrl: dto.owner.avatar_url,
      url: dto.url,
      isPrivate: dto.private,
    };
  }
}
