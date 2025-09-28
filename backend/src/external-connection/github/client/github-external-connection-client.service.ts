import { Injectable } from '@nestjs/common';
import { GithubRepository } from './dto/github-repository.dto';
import { GithubInstallationLiveData } from './dto/github-installation.dto';
import { GithubApiFacadeService, GithubApiRepository } from './github-api-facade.service';

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
  constructor(private readonly githubApiFacadeService: GithubApiFacadeService) {}

  public async getRepositoriesAvailableForInstallation(
    installationId: number,
  ): Promise<GithubRepository[]> {
    const repositories =
      await this.githubApiFacadeService.getInstallationRepositories(installationId);

    return repositories.map((repo) => this.mapGithubApiRepository(repo));
  }

  public async getInstallationByGithubInstallationId(
    installationId: number,
  ): Promise<GithubInstallationLiveData> {
    const installation = await this.githubApiFacadeService.getInstallationById(installationId);

    const account = installation.account || { avatar_url: '', login: '' };

    return {
      id: installationId,
      avatar: account?.avatar_url || '',
      owner: 'login' in account ? account.login! : account?.name || '',
    };
  }

  public async deleteInstallation(installationId: number): Promise<void> {
    await this.githubApiFacadeService.deleteInstallation(installationId);
  }

  public async getRepositoryInfoByInstallationIdAndRepositoryId(params: {
    repositoryId: number;
    githubInstallationId: number;
  }): Promise<GithubRepository> {
    const repository = await this.githubApiFacadeService.getRepositoryById(params);

    return this.mapGithubApiRepository(repository);
  }

  public async getInstallationAccessToken(installationId: number): Promise<string> {
    const accessToken =
      await this.githubApiFacadeService.createInstallationAccessToken(installationId);

    return accessToken.token;
  }

  public async getRepositoryPublicKey(params: {
    owner: string;
    githubInstallationId: number;
    repositoryName: string;
  }): Promise<GithubRepositoryKey> {
    const publicKey = await this.githubApiFacadeService.getRepositoryPublicKey(params);

    return {
      keyId: publicKey.key_id,
      key: publicKey.key,
    };
  }

  private mapGithubApiRepository(dto: GithubApiRepository): GithubRepository {
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
