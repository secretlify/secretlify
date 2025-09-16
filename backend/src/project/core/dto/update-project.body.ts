import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateProjectBody {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  public encryptedKeyVersions?: Record<string, string>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public encryptedSecrets?: string;
}
