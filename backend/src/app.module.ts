import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthCoreModule } from './auth/core/auth-core.module';
import { GithubAuthModule } from './auth/github/github-auth.module';
import { GoogleAuthModule } from './auth/google/google-auth.module';
import { InvitationCoreModule } from './invitation/core/invitation-core.module';
import { ProjectSecretsVersionCoreModule } from './project-secrets-version/core/project-secrets-version-core.module';
import { ProjectCoreModule } from './project/core/project-core.module';
import { getEnvConfig } from './shared/config/env-config';
import { LogdashModule } from './shared/logdash/logdash.module';
import { UserCoreModule } from './user/core/user-core.module';

@Module({
  imports: [
    MongooseModule.forRoot(getEnvConfig().mongo.url),
    UserCoreModule,
    ProjectCoreModule,
    ProjectSecretsVersionCoreModule,
    InvitationCoreModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthCoreModule,
    LogdashModule,
    GoogleAuthModule,
    GithubAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
