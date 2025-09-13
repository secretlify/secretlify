import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomJwtService } from '../custom-jwt/custom-jwt.service';
import { UserReadService } from '../../user/read/user-read.service';
import { UserWriteService } from '../../user/write/user-write.service';
import { AuthMethod } from '../../user/core/enum/auth-method.enum';
import { AuthEventEmitter } from '../events/auth-event.emitter';
import { GoogleLoginBody } from './dto/google-login.body';
import { TokenResponse } from '../../shared/responses/token.response';
import { GoogleAuthDataService } from './google-auth-data.service';
import { Logger, Metrics } from '@logdash/js-sdk';

@Injectable()
export class GoogleAuthLoginService {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly userReadService: UserReadService,
    private readonly userWriteService: UserWriteService,
    private readonly emitter: AuthEventEmitter,
    private readonly logger: Logger,
    private readonly authGoogleDataService: GoogleAuthDataService,
    private readonly metrics: Metrics,
  ) {}

  public async login(dto: GoogleLoginBody): Promise<TokenResponse> {
    this.logger.log(`Logging user in...`);

    const accessToken = await this.authGoogleDataService.getAccessToken(
      dto.googleCode,
      dto.forceLocalLogin,
    );

    const { email, avatar } = await this.authGoogleDataService.getGoogleEmailAndAvatar(accessToken);

    if (email.length === 0 || !email) {
      this.logger.error('Email not found in google response');
      throw Error('Email not found in google response');
    }

    const user = await this.userReadService.readByEmail(email);

    this.logger.log(`After reading user by email`, { email, userId: user?.id });

    if (user === null) {
      const user = await this.userWriteService.create({
        authMethod: AuthMethod.Google,
        email,
        avatarUrl: avatar,
      });

      this.logger.log(`Created new user`, { email, userId: user.id });

      this.metrics.mutate('loginGoogle', 1);

      return {
        token: await this.jwtService.sign({ id: user.id }),
      };
    }

    this.logger.log(`Logged in existing user`, { email, userId: user.id });

    this.metrics.mutate('loginGoogle', 1);

    return {
      token: await this.jwtService.sign({ id: user.id }),
    };
  }
}
