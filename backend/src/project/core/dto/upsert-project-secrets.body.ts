import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpsertProjectSecretsBody {
  @ApiProperty()
  @IsString()
  @MaxLength(10704)
  public encryptedSecrets: string;
}
