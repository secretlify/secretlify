import { Module } from '@nestjs/common';
import { IntegrationCoreController } from './integration.core.controller';
import { GithubIntegrationModule } from 'src/integration/github/github-integration.module';
import { IntegrationProvidersMap } from 'src/shared/constants/symbol';
import { IntegrationType } from 'src/integration/core/enums/integration-type.enum';
import { GithubIntegrationService } from 'src/integration/github/github-integration.service';
import { IntegrationCoreService } from 'src/integration/core/integration.core.service';

@Module({
  imports: [GithubIntegrationModule],
  controllers: [IntegrationCoreController],
  providers: [
    IntegrationCoreService,
    {
      provide: IntegrationProvidersMap,
      useFactory: (githubIntegrationService: GithubIntegrationService) => ({
        [IntegrationType.Github]: githubIntegrationService,
      }),
      inject: [GithubIntegrationService],
    },
  ],
})
export class IntegrationCoreModule {}
