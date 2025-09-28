import axios from "axios";
import { SodiumCrypto } from "../crypto/crypto.sodium";

export interface Repository {
  id: number;
  name: string;
  owner: string;
  url: string;
  isPrivate: boolean;
  avatarUrl: string;
}

export interface Integration {
  id: string;
  projectId: string;
  githubRepositoryId: number;
  githubRepositoryPublicKey: string;
  githubRepositoryPublicKeyId: string;
  installationEntityId: string;
  repositoryData?: Repository;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntegrationDto {
  repositoryId: number;
  installationEntityId: string;
  projectId: string;
}

export interface Installation {
  id: string;
  userId: string;
  githubInstallationId: number;
  liveData?: {
    owner: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstallationDto {
  githubInstallationId: number;
}

export interface PushSecretDto {
  owner: string;
  repo: string;
  secretName: string;
  encryptedValue: string;
  keyId: string;
}

export interface SecretDto {
  key: string;
  plainValue: string;
}

export class IntegrationsApi {
  public static async getRepositories(
    jwtToken: string,
    installationEntityId: string
  ): Promise<Repository[]> {
    const response = await axios.get<Repository[]>(
      `/external-connections/github/installations/${installationEntityId}/repositories`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    return response.data;
  }

  public static async getIntegrationsForProject(
    jwtToken: string,
    projectId: string
  ): Promise<Integration[]> {
    const response = await axios.get<Integration[]>(
      `/projects/${projectId}/external-connections/github/integrations`,
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );

    return response.data;
  }

  public static async createIntegration(
    jwtToken: string,
    dto: CreateIntegrationDto
  ): Promise<void> {
    await axios.post<void>(`/external-connections/github/integrations`, dto, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
  }

  public static async createInstallation(
    jwtToken: string,
    dto: CreateInstallationDto
  ): Promise<void> {
    await axios.post<void>(
      `/users/me/external-connections/github/installations`,
      dto,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );
  }

  public static async getInstallationAvailableForUser(
    jwtToken: string
  ): Promise<Installation[]> {
    const response = await axios.get<Installation[]>(
      `/users/me/external-connections/github/installations`,
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );

    return response.data;
  }

  public static async getInstallation(
    jwtToken: string,
    installationId: number
  ): Promise<Installation> {
    const response = await axios.get<Installation>(
      `/integrations/github/installations/${installationId}`,
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );

    return response.data;
  }

  public static async deleteInstallationFromProject(
    jwtToken: string,
    projectId: string
  ): Promise<void> {
    await axios.delete(
      `/projects/${projectId}/integrations/github/installations`,
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );
  }

  public static async deleteIntegration(
    jwtToken: string,
    integrationId: string
  ): Promise<void> {
    await axios.delete(
      `/external-connections/github/integrations/${integrationId}`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );
  }

  public static async getAccessToken(
    jwtToken: string,
    installationEntityId: string
  ): Promise<string> {
    const response = await axios.get<{ token: string }>(
      `/external-connections/github/installations/${installationEntityId}/access-token`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );

    return response.data.token;
  }

  public static async pushSecret(
    githubJwtToken: string,
    dto: PushSecretDto
  ): Promise<void> {
    await axios.put(
      `https://api.github.com/repos/${dto.owner}/${dto.repo}/actions/secrets/${dto.secretName}`,
      {
        encrypted_value: dto.encryptedValue,
        key_id: dto.keyId,
      },
      {
        headers: { Authorization: `Bearer ${githubJwtToken}` },
      }
    );
  }

  public static async pushSecrets(
    jwtToken: string,
    integrations: Integration[],
    content: string
  ): Promise<void> {
    const secrets: SecretDto[] = [];
    const lines = content.split("\n");
    for (const line of lines) {
      const [key, value] = line.split("=");
      secrets.push({ key, plainValue: value });
    }
    for (const integration of integrations) {
      const publicKey = integration.githubRepositoryPublicKey;

      const githubToken = await this.getAccessToken(
        jwtToken,
        integration.installationEntityId
      );
      await Promise.all(
        secrets.map(async (secret) => {
          const encryptedValue = await SodiumCrypto.encrypt(
            secret.plainValue,
            publicKey
          );

          await this.pushSecret(githubToken, {
            encryptedValue,
            keyId: integration.githubRepositoryPublicKeyId,
            owner: integration.repositoryData?.owner!,
            repo: integration.repositoryData?.name!,
            secretName: secret.key,
          });
        })
      );
    }
  }
}
