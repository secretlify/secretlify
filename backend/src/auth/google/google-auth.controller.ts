import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../core/decorators/is-public';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthLoginService } from './google-auth-login.service';
import { GoogleLoginBody } from './dto/google-login.body';
import { TokenResponse } from '../../shared/responses/token.response';

@Public()
@Controller('auth/google')
@ApiTags('Auth (google)')
export class GoogleAuthController {
  constructor(private readonly loginService: GoogleAuthLoginService) {}

  @Post('login')
  @ApiResponse({ type: TokenResponse })
  public async login(@Body() payload: GoogleLoginBody): Promise<TokenResponse> {
    return this.loginService.login(payload);
  }
}
