import axios from "axios";

interface LoginGoogleResponse {
  token: string;
}

export class AuthApi {
  public static async loginGoogle(
    googleCode: string
  ): Promise<LoginGoogleResponse> {
    const response = await axios.post("/auth/google/login", {
      googleCode,
      forceLocalLogin: true,
    });

    return response.data;
  }

  public static async veryLongRequest(): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    return 5;
  }
}
