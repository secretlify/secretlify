import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, MaxLength } from 'class-validator';
import { ENCRYPTED_SECRETS_MAX_LENGTH } from 'src/shared/constants/validation';

export class CreateProjectBody {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(ENCRYPTED_SECRETS_MAX_LENGTH)
  public encryptedSecrets: string;

  @ApiProperty()
  @IsObject()
  public encryptedKeyVersions: Record<string, string>;
}
