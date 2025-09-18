import { ApiProperty } from '@nestjs/swagger';
import { UserId } from 'src/shared/types/user-id';
import { Branded } from '../../../shared/types/branded';

export type EnvName = Branded<string, 'EnvName'>;

export class ProjectNormalized {
  public id: string;
  public name: string;
  public owner: UserId;
  public members: UserId[];
  public encryptedKeyVersions: Record<string, string>;
  public encryptedSecretsHistory: string[];
}

export class ProjectSerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public owner: string;

  @ApiProperty()
  public members: string[];

  @ApiProperty()
  public encryptedKeyVersions: Record<string, string>;

  @ApiProperty()
  public encryptedSecrets: string;
}

export class ProjectHistorySerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public owner: string;

  @ApiProperty()
  public members: string[];

  @ApiProperty()
  public encryptedKeyVersions: Record<string, string>;

  @ApiProperty()
  public encryptedSecretsHistory: string[];
}
