import axios from "axios";

export type JwtToken = string;

export class AuthApi {
  public static async loginGoogle(googleCode: string): Promise<JwtToken> {
    const response = await axios.post("/auth/google/login", {
      googleCode,
    });

    return response.data.token;
  }
}
