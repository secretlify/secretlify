import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/shared/types/role.enum';
import { Branded } from '../../../shared/types/branded';
import { UserPartialSerialized } from '../../../user/core/entities/user.interface';
import { Integrations } from './project.entity';

export type EnvName = Branded<string, 'EnvName'>;

export class IntegrationsNormalized {
  public githubInstallationId?: number;
}

export class ProjectNormalized {
  public id: string;
  public name: string;
  public members: Map<string, Role>;
  public encryptedSecretsKeys: Record<string, string>;
  public createdAt: Date;
  public updatedAt: Date;
  public integrations: IntegrationsNormalized;
}

export class ProjectMemberSerialized extends UserPartialSerialized {
  @ApiProperty({ enum: Object.values(Role) })
  public role: Role;
}

export class IntegrationsSerialized {
  @ApiProperty()
  public githubInstallationId: number;
}

export class ProjectSerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty({ type: [ProjectMemberSerialized] })
  public members: ProjectMemberSerialized[];

  @ApiProperty()
  public encryptedSecretsKeys: Record<string, string>;

  @ApiProperty()
  public encryptedSecrets: string;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updatedAt: string;

  @ApiPropertyOptional()
  public integrations: IntegrationsSerialized;
}
