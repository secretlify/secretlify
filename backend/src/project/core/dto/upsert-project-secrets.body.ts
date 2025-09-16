import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertProjectSecretsBody {
  @ApiProperty()
  @IsString()
  public encryptedSecrets: string;
}
