import axios from "axios";

export enum ProjectMemberRole {
  Owner = "owner",
  Member = "member",
}

export interface ProjectMember {
  id: string;
  email: string;
  avatarUrl: string;
  role: ProjectMemberRole;
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  encryptedSecretsKeys: Record<string, string>;
  encryptedSecrets: string;
  members: ProjectMember[];
  updatedAt: string;
}

export interface Version {
  id: string;
  encryptedSecrets: string;
  createdAt: string;
  updatedAt: string;
  author: ProjectMember;
}

export interface CreateProjectDto {
  name: string;
  encryptedSecrets: string;
  encryptedSecretsKeys: Record<string, string>;
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
  ): Promise<Version[]> {
    const response = await axios.get<Version[]>(
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
