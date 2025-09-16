import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectBody {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public encryptedPassphrase?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public encryptedSecrets?: string;
}
