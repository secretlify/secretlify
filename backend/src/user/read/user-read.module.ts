import { Module } from '@nestjs/common';
import { UserReadService } from './user-read.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from '../core/entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
  providers: [UserReadService],
  exports: [UserReadService],
})
export class UserReadModule {}
