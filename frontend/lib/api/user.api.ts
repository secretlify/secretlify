import axios from "axios";

type AuthMethod = "google" | "github";

export interface UserSerialized {
  id: string;
  email: string;
  authMethod: AuthMethod;
}

export class UserApi {
  public static async getMe(jwtToken: string): Promise<UserSerialized> {
    const response = await axios.get("/users/me", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.data;
  }
}
