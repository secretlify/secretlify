import axios from "axios";

export type JwtToken = string;

function isLocal(): boolean {
  return window.location.hostname === "localhost";
}

export class AuthApi {
  public static async loginGoogle(googleCode: string): Promise<JwtToken> {
    const response = await axios.post("/auth/google/login", {
      googleCode,
      forceLocalLogin: isLocal(),
    });

    return response.data.token;
  }

  public static async loginGithub(githubCode: string): Promise<JwtToken> {
    const response = await axios.post("/auth/github/login", {
      githubCode,
      forceLocalLogin: isLocal(),
    });

    return response.data.token;
  }
}
