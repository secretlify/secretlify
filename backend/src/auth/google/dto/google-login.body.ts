import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoogleLoginBody {
  @ApiProperty()
  googleCode: string;

  forceLocalLogin?: boolean;
}
