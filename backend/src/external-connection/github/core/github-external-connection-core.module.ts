import { Module } from '@nestjs/common';
import { GithubExternalConnectionReadModule } from '../read/github-external-connection-read.module';
import { GithubExternalConnectionWriteModule } from '../write/github-external-connection-write.module';
import { GithubExternalConnectionClientModule } from '../client/github-external-connection-client.module';
import { GithubExternalConnectionCoreController } from './github-external-connection-core.controller';
import { ProjectCoreModule } from 'src/project/core/project-core.module';

@Module({
  imports: [
    GithubExternalConnectionReadModule,
    GithubExternalConnectionWriteModule,
    GithubExternalConnectionClientModule,
    ProjectCoreModule,
  ],
  controllers: [GithubExternalConnectionCoreController],
})
export class GithubExternalConnectionCoreModule {}
