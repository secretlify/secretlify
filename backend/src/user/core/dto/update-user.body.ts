import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserBody {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  public publicKey?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  public privateKeyEncrypted?: string;
}
