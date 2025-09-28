import { Injectable } from '@nestjs/common';
import { getEnvConfig } from '../../../shared/config/env-config';
import { sign } from 'jsonwebtoken';

export interface GithubApiInstallation {
  id: number;
  account?: {
    login?: string;
    name?: string;
    avatar_url?: string;
  } | null;
}

export interface GithubApiRepository {
  id: number;
  name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  url: string;
  private: boolean;
  full_name: string;
}

export interface GithubApiAccessToken {
  token: string;
  expires_at: string;
}

export interface GithubApiRepositoryPublicKey {
  key_id: string;
  key: string;
}

@Injectable()
export class GithubApiFacadeService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly config = getEnvConfig().github.app;
  private readonly installationTokens = new Map<number, { token: string; expiresAt: Date }>();

  constructor() {}

  private generateJwtToken(): string {
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 600,
      iss: this.config.id,
    };

    return sign(payload, this.config.privateKey, { algorithm: 'RS256' });
  }

  private async getInstallationAccessToken(installationId: number): Promise<string> {
    const cached = this.installationTokens.get(installationId);
    if (cached && cached.expiresAt > new Date()) {
      return cached.token;
    }

    const jwtToken = this.generateJwtToken();
    const response = await fetch(
      `${this.baseUrl}/app/installations/${installationId}/access_tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Secretlify',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: GithubApiAccessToken = await response.json();
    const token = data.token;
    const expiresAt = new Date(data.expires_at);
    this.installationTokens.set(installationId, { token, expiresAt });

    return token;
  }

  private async makeAuthenticatedRequest<T>(
    method: 'GET' | 'POST' | 'DELETE',
    url: string,
    installationId?: number,
    data?: any,
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Secretlify',
    };

    if (installationId) {
      const token = await this.getInstallationAccessToken(installationId);
      headers.Authorization = `token ${token}`;
    } else {
      const jwtToken = this.generateJwtToken();
      headers.Authorization = `Bearer ${jwtToken}`;
    }

    if (data && method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (data && method !== 'GET') {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    if (method === 'DELETE' && response.status === 204) {
      return undefined as unknown as T;
    }

    return response.json();
  }

  public async getInstallationRepositories(installationId: number): Promise<GithubApiRepository[]> {
    let allRepositories: GithubApiRepository[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await this.makeAuthenticatedRequest<{
        repositories: any[];
        total_count: number;
      }>('GET', `/installation/repositories?per_page=100&page=${page}`, installationId);

      const repositories = response.repositories;

      allRepositories = allRepositories.concat(repositories);
      hasNextPage = response.repositories.length === 100;
      page++;
    }

    return allRepositories;
  }

  public async getInstallationById(installationId: number): Promise<GithubApiInstallation> {
    const response = await this.makeAuthenticatedRequest<any>(
      'GET',
      `/app/installations/${installationId}`,
    );

    return {
      id: response.id,
      account: response.account,
    };
  }

  public async deleteInstallation(installationId: number): Promise<void> {
    await this.makeAuthenticatedRequest<void>('DELETE', `/app/installations/${installationId}`);
  }

  public async getRepositoryById(params: {
    repositoryId: number;
    githubInstallationId: number;
  }): Promise<GithubApiRepository> {
    const response = await this.makeAuthenticatedRequest<any>(
      'GET',
      `/repositories/${params.repositoryId}`,
      params.githubInstallationId,
    );

    return {
      id: response.id,
      name: response.name,
      owner: {
        login: response.owner.login,
        avatar_url: response.owner.avatar_url,
      },
      url: response.url,
      private: response.private,
      full_name: response.full_name,
    };
  }

  public async createInstallationAccessToken(
    installationId: number,
  ): Promise<GithubApiAccessToken> {
    const jwtToken = this.generateJwtToken();
    const response = await fetch(
      `${this.baseUrl}/app/installations/${installationId}/access_tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Secretlify',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  public async getRepositoryPublicKey(params: {
    owner: string;
    githubInstallationId: number;
    repositoryName: string;
  }): Promise<GithubApiRepositoryPublicKey> {
    const response = await this.makeAuthenticatedRequest<GithubApiRepositoryPublicKey>(
      'GET',
      `/repos/${params.owner}/${params.repositoryName}/actions/secrets/public-key`,
      params.githubInstallationId,
    );

    return response;
  }
}
