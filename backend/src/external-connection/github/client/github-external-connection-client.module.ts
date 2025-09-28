import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubExternalConnectionClientService } from './github-external-connection-client.service';
import { GithubApiFacadeService } from './github-api-facade.service';

@Module({
  imports: [HttpModule],
  providers: [GithubExternalConnectionClientService, GithubApiFacadeService],
  exports: [GithubExternalConnectionClientService],
})
export class GithubExternalConnectionClientModule {}
