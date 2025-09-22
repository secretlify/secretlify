import { Logger, Metrics } from '@logdash/js-sdk';
import { Injectable } from '@nestjs/common';
import { TokenResponse } from '../../shared/responses/token.response';
import { AuthMethod } from '../../user/core/enum/auth-method.enum';
import { UserReadService } from '../../user/read/user-read.service';
import { UserWriteService } from '../../user/write/user-write.service';
import { CustomJwtService } from '../custom-jwt/custom-jwt.service';
import { GithubLoginBody } from './dto/github-login.body';
import { GithubAuthDataService } from './github-auth-data.service';

@Injectable()
export class GithubAuthLoginService {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly userReadService: UserReadService,
    private readonly userWriteService: UserWriteService,
    private readonly logger: Logger,
    private readonly authGithubDataService: GithubAuthDataService,
    private readonly metrics: Metrics,
  ) {}

  public async login(dto: GithubLoginBody): Promise<TokenResponse> {
    this.logger.log(`Logging user in...`);

    const accessToken = await this.authGithubDataService.getAccessToken(
      dto.githubCode,
      dto.forceLocalLogin,
    );

    const email = await this.authGithubDataService.getGithubEmail(accessToken);

    if (email.length === 0 || !email) {
      this.logger.error('Email not found in github response');
      throw Error('Email not found in github response');
    }

    const user = await this.userReadService.readByEmail(email);

    this.logger.log(`After reading user by email`, { email, userId: user?.id });

    if (user === null) {
      const avatarUrl = await this.authGithubDataService.getGithubAvatar(accessToken);

      const user = await this.userWriteService.create({
        authMethod: AuthMethod.Github,
        email,
        avatarUrl,
      });

      this.logger.log(`Created new user`, { email, userId: user.id });

      this.metrics.mutate('loginGithub', 1);

      return {
        token: await this.jwtService.sign({ id: user.id }),
        isNewUser: true,
      };
    }

    this.logger.log(`Logged in existing user`, { email, userId: user.id });

    this.metrics.mutate('loginGithub', 1);

    return {
      token: await this.jwtService.sign({ id: user.id }),
      isNewUser: false,
    };
  }
}
