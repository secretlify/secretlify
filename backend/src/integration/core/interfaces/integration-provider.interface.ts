import { ApiProperty } from '@nestjs/swagger';
import { IntegrationType } from 'src/integration/core/enums/integration-type.enum';

export type CreateIntegrationDto = {
  projectId: string;
  repositoryId: string;
};

export interface IIntegrationProvider {
  create: (dto: CreateIntegrationDto) => Promise<ProviderIntegrationSerialized>;
}

export class ProviderIntegrationSerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public cryptlyProjectId: string;

  @ApiProperty({ description: 'Repository ID in the given VCS' })
  public repositoryId: string;

  @ApiProperty({ enum: IntegrationType })
  public type: IntegrationType;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updatedAt: string;
}
