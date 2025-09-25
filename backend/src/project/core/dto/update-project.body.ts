import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { ENCRYPTED_SECRETS_MAX_LENGTH } from '../../../shared/constants/validation';

export class UpdateProjectBody {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  public encryptedSecretsKeys?: Record<string, string>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(ENCRYPTED_SECRETS_MAX_LENGTH)
  public encryptedSecrets?: string;
}
