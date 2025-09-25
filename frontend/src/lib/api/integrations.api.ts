import axios from "axios";

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  isPrivate: boolean;
}

export class IntegrationsApi {
  public static async getRepositories(
    jwtToken: string,
    installationId: number,
    nameSearchString: string
  ): Promise<Repository[]> {
    const response = await axios.get<Repository[]>(
      `/integrations/github/installations/${installationId}/repositories?name=${
        nameSearchString || ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    return response.data;
  }
}
