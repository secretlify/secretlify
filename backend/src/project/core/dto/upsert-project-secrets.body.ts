import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { ENCRYPTED_SECRETS_MAX_LENGTH } from '../../../shared/constants/validation';

export class UpsertProjectSecretsBody {
  @ApiProperty()
  @IsString()
  @MaxLength(ENCRYPTED_SECRETS_MAX_LENGTH)
  public encryptedSecrets: string;
}
