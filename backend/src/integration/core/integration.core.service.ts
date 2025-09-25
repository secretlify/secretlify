import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IntegrationType } from 'src/integration/core/enums/integration-type.enum';
import { Logger } from '@logdash/js-sdk';
import { IntegrationProvidersMap } from 'src/shared/constants/symbol';
import {
  IIntegrationProvider,
  ProviderIntegrationSerialized,
} from 'src/integration/core/interfaces/integration-provider.interface';
import { CreateIntegrationDto } from 'src/integration/core/dto/create-integration.dto';

@Injectable()
export class IntegrationCoreService {
  public constructor(
    private readonly logger: Logger,
    @Inject(IntegrationProvidersMap)
    private readonly integrationsMap: Record<IntegrationType, IIntegrationProvider>,
  ) {}

  public async createIntegration(
    dto: CreateIntegrationDto,
  ): Promise<ProviderIntegrationSerialized> {
    const integrationProvider = this.integrationsMap[dto.type];

    if (!integrationProvider) {
      this.logger.error('No integrationProvider found for integration type', { type: dto.type });
      throw new BadRequestException('Unknown integration type');
    }

    return integrationProvider.create({ projectId: dto.projectId, repositoryId: dto.repositoryId });
  }
}
