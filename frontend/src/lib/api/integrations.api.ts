import axios from "axios";

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  isPrivate: boolean;
}

export interface Integration {
  projectId: string;
  repositoryId: string;
  publicKey: string;
  publicKeyId: string;
  name: string;
  owner: string;
  fullName: string;
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
}
