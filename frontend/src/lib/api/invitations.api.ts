import axios from "axios";

export interface Invitation {
  id: string;
  projectId: string;
  authorId: string;
  temporaryPublicKey: string;
  temporaryPrivateKey: string;
  temporaryServerPassphrase: string;
}

export interface CreateInvitationDto {
  projectId: string;
  temporaryPublicKey: string;
  temporaryPrivateKey: string;
  temporaryServerPassphrase: string;
}

export class InvitationsApi {
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
}
