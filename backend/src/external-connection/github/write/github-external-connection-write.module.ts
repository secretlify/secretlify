import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubIntegrationWriteService } from './github-integration-write.service';
import {
  GithubIntegrationEntity,
  GithubIntegrationSchema,
} from '../core/entities/github-integration.entity';
import {
  GithubInstallationEntity,
  GithubInstallationSchema,
} from '../core/entities/github-installation.entity';
import { GithubInstallationWriteService } from './github-installation-write.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GithubIntegrationEntity.name, schema: GithubIntegrationSchema },
    ]),
    MongooseModule.forFeature([
      { name: GithubInstallationEntity.name, schema: GithubInstallationSchema },
    ]),
  ],
  providers: [GithubIntegrationWriteService, GithubInstallationWriteService],
  exports: [GithubIntegrationWriteService, GithubInstallationWriteService],
})
export class GithubExternalConnectionWriteModule {}
