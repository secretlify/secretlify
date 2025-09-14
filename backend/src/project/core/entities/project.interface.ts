import { ApiProperty } from '@nestjs/swagger';
import { UserId } from 'src/shared/types/user-id';
import { Branded } from '../../../shared/types/branded';

export type EnvName = Branded<string, 'EnvName'>;

export class ProjectNormalized {
  public id: string;
  public name: string;
  public owner: UserId;
  public members: UserId[];
  public encryptedPassphrases: Record<UserId, string>;
  public encryptedSecrets: Record<EnvName, string>;
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
  public encryptedPassphrases: Record<string, string>;

  @ApiProperty({ required: false })
  public encryptedSecrets: Record<string, string>;
}
