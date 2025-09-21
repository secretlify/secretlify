import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/shared/types/role.enum';
import { Branded } from '../../../shared/types/branded';

export type EnvName = Branded<string, 'EnvName'>;

export class ProjectNormalized {
  public id: string;
  public name: string;
  public members: Map<string, Role>;
  public encryptedKeyVersions: Record<string, string>;
  public encryptedSecretsHistory: string[];
  public createdAt: Date;
  public updatedAt: Date;
}

export class ProjectSerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty({ type: 'object', additionalProperties: { enum: Object.values(Role) } })
  public members: Record<string, Role>;

  @ApiProperty()
  public encryptedKeyVersions: Record<string, string>;

  @ApiProperty()
  public encryptedSecrets: string;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updatedAt: string;
}

export class ProjectHistorySerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty({ type: 'object', additionalProperties: { enum: Object.values(Role) } })
  public members: Record<string, Role>;

  @ApiProperty()
  public encryptedKeyVersions: Record<string, string>;

  @ApiProperty()
  public encryptedSecretsHistory: string[];
}
