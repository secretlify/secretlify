import { Module } from '@nestjs/common';
import { GithubExternalConnectionClientService } from './github-external-connection-client.service';

@Module({
  providers: [GithubExternalConnectionClientService],
  exports: [GithubExternalConnectionClientService],
})
export class GithubExternalConnectionClientModule {}
