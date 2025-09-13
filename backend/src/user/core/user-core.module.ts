import { Module } from '@nestjs/common';
import { UserCoreController } from './user-core.controller';
import { UserReadModule } from '../read/user-read.module';
import { UserWriteModule } from '../write/user-write.module';
import { CustomJwtModule } from '../../auth/custom-jwt/custom-jwt.module';

@Module({
  imports: [UserReadModule, UserWriteModule, CustomJwtModule],
  providers: [],
  controllers: [UserCoreController],
})
export class UserCoreModule {}
