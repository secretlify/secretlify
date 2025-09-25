import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubIntegrationReadService } from './github-integration-read.service';
import {
  GithubIntegrationEntity,
  GithubIntegrationSchema,
} from 'src/integration/github/entities/github-integration.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GithubIntegrationEntity.name, schema: GithubIntegrationSchema },
    ]),
  ],
  providers: [GithubIntegrationReadService],
  exports: [GithubIntegrationReadService],
})
export class GithubIntegrationReadModule {}
