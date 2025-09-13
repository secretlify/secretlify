import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCoreModule } from './user/core/user-core.module';
import { getEnvConfig } from './shared/config/env-config';
import { AuthCoreModule } from './auth/core/auth-core.module';
import { LogdashModule } from './shared/logdash/logdash.module';

@Module({
  imports: [
    MongooseModule.forRoot(getEnvConfig().mongo.url),
    UserCoreModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthCoreModule,
    LogdashModule,
  ],
})
export class AppModule {}
