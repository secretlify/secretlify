import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class CreateProjectBody {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  public encryptedSecrets: string;

  @ApiProperty()
  @IsObject()
  public encryptedServerPassphrases: Record<string, string>;
}
