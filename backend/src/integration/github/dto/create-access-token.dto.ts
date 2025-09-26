import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateAccessTokenBodyDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  public installationId: number;
}

export class CreateAccessTokenResponseDto {
  @ApiProperty()
  public token: string;
  @ApiProperty({ description: 'timestamp in GMT+0, token valid for 1h' })
  public expiresAt: string;
}
