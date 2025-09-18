import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, MaxLength } from 'class-validator';

export class CreateProjectBody {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10704)
  public encryptedSecrets: string;

  @ApiProperty()
  @IsObject()
  public encryptedKeyVersions: Record<string, string>;
}
