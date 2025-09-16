import axios from "axios";

export interface User {
  id: string;
  email: string;
  authMethod: string;
  avatarUrl: string;
  publicKey?: string;
  privateKeyEncrypted?: string;
}

export interface UpdateUserDto {
  publicKey?: string;
  privateKeyEncrypted?: string;
}

export class UserApi {
  public static async getMe(jwtToken: string): Promise<User> {
    const response = await axios.get<User>("/users/me", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data;
  }

  public static async updateMe(
    jwtToken: string,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    const response = await axios.patch<User>("/users/me", updateUserDto, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data;
  }

  public static async deleteKeys(jwtToken: string): Promise<void> {
    await axios.delete("/users/keys", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  }
}
