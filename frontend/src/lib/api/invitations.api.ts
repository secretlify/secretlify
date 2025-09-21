import axios from "axios";

export interface Invitation {
  id: string;
  projectId: string;
  authorId: string;
  temporaryPublicKey: string;
  temporaryPrivateKey: string;
  temporaryServerPassphrase: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationDto {
  projectId: string;
  temporaryPublicKey: string;
  temporaryPrivateKey: string;
  temporaryServerPassphrase: string;
}

export interface AcceptInvitationDto {
  newServerPassphrase: string;
}

export class InvitationsApi {
  public static async getInvitation(
    jwtToken: string,
    invitationId: string
  ): Promise<Invitation> {
    const response = await axios.get<Invitation>(
      `/invitations/${invitationId}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response.data;
  }

  public static async getInvitations(jwtToken: string): Promise<Invitation[]> {
    const response = await axios.get<Invitation[]>(`/invitations/me`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.data;
  }

  public static async createInvitation(
    jwtToken: string,
    dto: CreateInvitationDto
  ): Promise<Invitation> {
    const response = await axios.post<Invitation>(`/invitations`, dto, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data;
  }

  public static async deleteInvitation(
    jwtToken: string,
    invitationId: string
  ): Promise<void> {
    await axios.delete(`/invitations/${invitationId}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
  }

  public static async acceptInvitation(
    jwtToken: string,
    invitationId: string,
    dto: AcceptInvitationDto
  ): Promise<void> {
    await axios.post(`/invitations/${invitationId}/accept`, dto, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
  }
}
