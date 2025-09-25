import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubIntegrationReadService } from './github-integration-read.service';
import {
  GithubIntegrationEntity,
  GithubIntegrationSchema,
} from '../core/entities/github-integration.entity';
import {
  GithubInstallationEntity,
  GithubInstallationSchema,
} from '../core/entities/github-installation.entity';
import { GithubInstallationReadService } from './github-installation-read.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GithubIntegrationEntity.name, schema: GithubIntegrationSchema },
    ]),
    MongooseModule.forFeature([
      { name: GithubInstallationEntity.name, schema: GithubInstallationSchema },
    ]),
  ],
  providers: [GithubIntegrationReadService, GithubInstallationReadService],
  exports: [GithubIntegrationReadService, GithubInstallationReadService],
})
export class GithubExternalConnectionReadModule {}
