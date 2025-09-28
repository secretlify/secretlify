import axios from "axios";
import { SodiumCrypto } from "../crypto/crypto.sodium";

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  isPrivate: boolean;
  avatarUrl: string;
}

export interface Integration {
  id: string;
  projectId: string;
  repositoryId: string;
  publicKey: string;
  publicKeyId: string;
  name: string;
  owner: string;
  fullName: string;
  installationId: number;
}

export interface CreateIntegrationDto {
  repositoryId: number;
  installationId: number;
  projectId: string;
}

export interface Installation {
  id: string;
  userId: string;
  githubInstallationId: number;
  liveData?: {};
  createdAt: string;
  updatedAt: string;
}

export interface GetInstallationAccessTokenDto {
  installationId: number;
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
    installationId: number
  ): Promise<Repository[]> {
    const response = await axios.get<Repository[]>(
      `/integrations/github/installations/${installationId}/repositories`,
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
    await axios.post<void>(`/integrations/github`, dto, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
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
    await axios.delete(`/integrations/github/${integrationId}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
  }

  public static async getAccessToken(
    jwtToken: string,
    dto: GetInstallationAccessTokenDto
  ): Promise<string> {
    const response = await axios.post<{ token: string }>(
      `/integrations/github/access-token`,
      dto,
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
    const response = await axios.put(
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
      const publicKey = integration.publicKey;

      const githubToken = await this.getAccessToken(jwtToken, {
        installationId: integration.installationId,
      });
      await Promise.all(
        secrets.map(async (secret) => {
          const encryptedValue = await SodiumCrypto.encrypt(
            secret.plainValue,
            publicKey
          );

          await this.pushSecret(githubToken, {
            encryptedValue,
            keyId: integration.publicKeyId,
            owner: integration.owner,
            repo: integration.name,
            secretName: secret.key,
          });
        })
      );
    }
  }
}
