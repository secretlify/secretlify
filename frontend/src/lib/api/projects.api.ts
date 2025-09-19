import axios from "axios";

export interface Project {
  id: string;
  name: string;
  owner: string;
  encryptedKeyVersions: Record<string, string>;
  encryptedSecrets: string;
}

export interface ProjectWithVersions extends Project {
  encryptedSecretsHistory: string[];
}

export interface CreateProjectDto {
  name: string;
  encryptedSecrets: string;
  encryptedKeyVersions: Record<string, string>;
}

export interface UpdateProjectContentDto {
  projectId: string;
  encryptedSecrets: string;
}

export class ProjectsApi {
  public static async getProject(
    jwtToken: string,
    projectId: string
  ): Promise<Project> {
    const response = await axios.get<Project>(`/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data;
  }

  public static async getProjectVersions(
    jwtToken: string,
    projectId: string
  ): Promise<ProjectWithVersions> {
    const response = await axios.get<ProjectWithVersions>(
      `/projects/${projectId}/history`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    return response.data;
  }

  public static async getProjects(jwtToken: string): Promise<Project[]> {
    const response = await axios.get<Project[]>("/users/me/projects", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

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

  public static async deleteProject(
    jwtToken: string,
    projectId: string
  ): Promise<void> {
    await axios.delete(`/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  }

  public static async updateProjectContent(
    jwtToken: string,
    dto: UpdateProjectContentDto
  ): Promise<void> {
    await axios.patch(`/projects/${dto.projectId}`, dto, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  }
}
