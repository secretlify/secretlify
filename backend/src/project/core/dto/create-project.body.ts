import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProjectBody {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  public encryptedSecrets: Record<string, string>;

  @ApiProperty()
  @IsString()
  public encryptedPassphrases: Record<string, string>;
}
