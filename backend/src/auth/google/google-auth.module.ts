import { Module } from '@nestjs/common';
import { GoogleAuthLoginService } from './google-auth-login.service';
import { UserReadModule } from '../../user/read/user-read.module';
import { UserWriteModule } from '../../user/write/user-write.module';
import { CustomJwtModule } from '../custom-jwt/custom-jwt.module';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthDataService } from './google-auth-data.service';

@Module({
  imports: [UserReadModule, UserWriteModule, CustomJwtModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthLoginService, GoogleAuthDataService],
})
export class GoogleAuthModule {}
