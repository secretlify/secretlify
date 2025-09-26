import { Injectable } from '@nestjs/common';
import { getEnvConfig } from 'src/shared/config/env-config';

@Injectable()
export class GithubAuthDataService {
  public async getAccessToken(code: string, forceLocalLogin?: boolean): Promise<string> {
    const { clientId, clientSecret } = await this.getGithubClientCredentials({
      useAlternative: forceLocalLogin || false,
    });

    const response = await fetch(`https://github.com/login/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await new Response(response.body).text();

    const token = data.split('&')[0].split('=')[1];

    return token;
  }

  public async getGithubEmail(accessToken: string): Promise<string> {
    const response = await fetch(`https://api.github.com/user/emails`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const emails = await response.json();

    return emails.find((email: any) => email.primary).email;
  }

  public async getGithubAvatar(accessToken: string): Promise<string> {
    const response = await fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = await response.json();

    return user.avatar_url;
  }

  private async getGithubClientCredentials(dto: {
    useAlternative: boolean;
  }): Promise<{ clientId: string; clientSecret: string }> {
    const config = getEnvConfig().oauth.github;

    if (dto.useAlternative) {
      return {
        clientId: config.clientIdAlternative!,
        clientSecret: config.clientSecretAlternative!,
      };
    }

    return {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    };
  }
}
