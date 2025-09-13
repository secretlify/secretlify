import { Injectable } from '@nestjs/common';
import { getEnvConfig } from 'src/shared/config/env-config';

@Injectable()
export class GoogleAuthDataService {
  public async getAccessToken(code: string, forceLocalLogin?: boolean): Promise<string> {
    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: getEnvConfig().oauth.google.clientId,
        client_secret: getEnvConfig().oauth.google.clientSecret,
        code: decodeURIComponent(code),
        grant_type: 'authorization_code',
        redirect_uri: forceLocalLogin
          ? getEnvConfig().oauth.google.redirectUriAlternative!
          : getEnvConfig().oauth.google.redirectUri,
      }),
    });

    const data = await response.json();

    console.log(data);
    return data.access_token;
  }

  public async getGoogleEmailAndAvatar(
    accessToken: string,
  ): Promise<{ email: string; avatar: string }> {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const user = await response.json();
    return { email: user.email, avatar: user.picture };
  }
}
