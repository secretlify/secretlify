import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProjectBody {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  public encryptedSecrets: string;

  @ApiProperty()
  @IsString()
  public encryptedPassphrase: string;
}
