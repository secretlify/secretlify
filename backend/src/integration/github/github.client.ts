import { Logger } from '@logdash/js-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { GithubCryptlyApp } from 'src/shared/constants/symbol';
import { Endpoints, OctokitResponse } from '@octokit/types';
import { EnvConfig, getEnvConfig } from 'src/shared/config/env-config';
import { App, RequestError } from 'octokit';
import { Octokit } from 'src/shared/types/octokit';

type GithubRepository = Endpoints['GET /repos/{owner}/{repo}']['response']['data'];
type GithubAppOrganisationInstallation =
  Endpoints['GET /orgs/{org}/installation']['response']['data'];
type RepositoryPublicKey =
  Endpoints['GET /repos/{owner}/{repo}/actions/secrets/public-key']['response']['data'];

export type GithubRepoDto = {
  id: number;
  fullName: string;
  owner: string;
  name: string;
  url: string;
  isPrivate: boolean;
};

export type RepoPublicKeyResponseDto = {
  keyId: string;
  key: string;
};

export type UpsertSecretBodyDto = {
  secrets: Record<string, string>;
  installationId: number; // we can fetch it by GET /repos/{owner}/{repo}/installation
  repositoryOwner: string;
  repositoryName: string;
  keyId: string;
};

@Injectable()
export class GithubClient {
  private readonly githubConfig: EnvConfig['github'];

  public constructor(
    private readonly logger: Logger,
    @Inject(GithubCryptlyApp) private readonly githubApp: App,
  ) {
    this.githubConfig = getEnvConfig().github;
  }

  private async getInstallationOctokit(installationId: number): Promise<Octokit> {
    return this.githubApp.getInstallationOctokit(installationId);
  }

  public async getInstallationId(): Promise<number> {
    const response: OctokitResponse<GithubAppOrganisationInstallation> =
      await this.githubApp.octokit.request('GET /orgs/{org}/installation', {
        org: this.githubConfig.app.organizationName,
      });

    return response.data.id;
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

  public async upsertSecrets(body: UpsertSecretBodyDto): Promise<{ failedSecrets: string[] }> {
    const octokit = await this.getInstallationOctokit(body.installationId);

    const failedSecrets: string[] = [];

    await Promise.all(
      Object.entries(body.secrets).map(async ([secretName, encryptedValue]) => {
        try {
          await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
            owner: body.repositoryOwner,
            repo: body.repositoryName,
            secret_name: secretName,
            encrypted_value: encryptedValue,
            key_id: body.keyId,
          });
        } catch (error) {
          // if (error instanceof RequestError) { } // true
          this.logger.error('Failed to upsert a secret', {
            secretName,
            errorMessage: error.message,
          });
          failedSecrets.push(secretName);
        }
      }),
    );

    return {
      failedSecrets, // todo: consider retries, probably return {key, value}[] instead of key[]
    };
  }

  private mapRepository(
    dto: Pick<GithubRepository, 'name' | 'id' | 'owner' | 'url' | 'private' | 'full_name'>,
  ): GithubRepoDto {
    return {
      id: dto.id,
      name: dto.name,
      owner: dto.owner.login,
      fullName: dto.full_name,
      url: dto.url,
      isPrivate: dto.private,
    };
  }
}
