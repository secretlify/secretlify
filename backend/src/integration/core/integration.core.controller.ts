import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateIntegrationDto } from 'src/integration/core/dto/create-integration.dto';
import { IntegrationCoreService } from 'src/integration/core/integration.core.service';
import { ProviderIntegrationSerialized } from 'src/integration/core/interfaces/integration-provider.interface';

@Controller('integrations')
@ApiTags('Integrations')
@ApiBearerAuth()
export class IntegrationCoreController {
  public constructor(private readonly integrationCoreService: IntegrationCoreService) {}

  @Post('/')
  public async createIntegration(
    @Body() body: CreateIntegrationDto,
  ): Promise<ProviderIntegrationSerialized> {
    return this.integrationCoreService.createIntegration(body);
  }
}
