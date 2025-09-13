import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginBody {
  @ApiProperty()
  googleCode: string;

  @ApiProperty()
  forceLocalLogin?: boolean;
}
