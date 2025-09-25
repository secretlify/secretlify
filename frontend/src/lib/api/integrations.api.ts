import axios from "axios";

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
}

export interface CreateIntegrationDto {
  repositoryId: number;
  installationId: number;
  projectId: string;
}

export interface Installation {
  id: number;
  owner: string;
  avatar: string;
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
      `/projects/${projectId}/integrations/github`,
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
}
