import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessTokenResponseDto {
  @ApiProperty()
  public token: string;
  @ApiProperty({ description: 'timestamp in GMT+0, token valid for 1h' })
  public expiresAt: string;
}
