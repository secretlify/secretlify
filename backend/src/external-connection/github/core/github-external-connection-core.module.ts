import { Module } from '@nestjs/common';
import { GithubExternalConnectionReadModule } from '../read/github-external-connection-read.module';
import { GithubExternalConnectionWriteModule } from '../write/github-external-connection-write.module';
import { GithubExternalConnectionClientModule } from '../client/github-external-connection-client.module';

@Module({
  imports: [
    GithubExternalConnectionReadModule,
    GithubExternalConnectionWriteModule,
    GithubExternalConnectionClientModule,
  ],
  controllers: [],
})
export class GithubExternalConnectionCoreModule {}
