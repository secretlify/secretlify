import { Module } from '@nestjs/common';
import { GithubExternalConnectionClientService } from './github-external-connection-client.service';
import { GithubApiFacadeService } from './github-api-facade.service';

@Module({
  imports: [],
  providers: [GithubExternalConnectionClientService, GithubApiFacadeService],
  exports: [GithubExternalConnectionClientService],
})
export class GithubExternalConnectionClientModule {}
