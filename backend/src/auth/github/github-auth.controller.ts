import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../core/decorators/is-public';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GithubAuthLoginService } from './github-auth-login.service';
import { GithubLoginBody } from './dto/github-login.body';
import { TokenResponse } from '../../shared/responses/token.response';

@Public()
@Controller('auth/github')
@ApiTags('Auth (github)')
export class GithubAuthController {
  constructor(private readonly loginService: GithubAuthLoginService) {}

  @Post('login')
  @ApiResponse({ type: TokenResponse })
  public async login(@Body() payload: GithubLoginBody): Promise<TokenResponse> {
    return this.loginService.login(payload);
  }
}
