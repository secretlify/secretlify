import axios from "axios";

export interface Project {
  id: string;
  name: string;
  owner: string;
  encryptedPassphrase: string;
  encryptedSecrets: string;
}

export interface CreateProjectDto {
  name: string;
  encryptedSecrets: string;
  encryptedPassphrase: string;
}

export class ProjectsApi {
  public static async getProjects(jwtToken: string): Promise<Project[]> {
    const response = await axios.get<Project[]>("/users/me/projects", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    console.log("response", response);

    return response.data;
  }

  public static async createProject(
    jwtToken: string,
    dto: CreateProjectDto
  ): Promise<Project> {
    const response = await axios.post<Project>("/projects", dto, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data;
  }
}
