import axios from "axios";

export interface User {
  email: string;
  authMethod: string;
}

export class UserApi {
  public static async loginGoogle(jwtToken: string): Promise<User> {
    const response = await axios.get<User>("/users/me", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data;
  }
}
