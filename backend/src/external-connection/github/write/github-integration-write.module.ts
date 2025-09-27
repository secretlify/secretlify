import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubIntegrationWriteService } from './github-integration-write.service';
import {
  GithubIntegrationEntity,
  GithubIntegrationSchema,
} from '../core/entities/github-integration.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GithubIntegrationEntity.name, schema: GithubIntegrationSchema },
    ]),
  ],
  providers: [GithubIntegrationWriteService],
  exports: [GithubIntegrationWriteService],
})
export class GithubIntegrationWriteModule {}
