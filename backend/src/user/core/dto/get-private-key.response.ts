import { ApiProperty } from '@nestjs/swagger';

export class GetPrivateKeyResponse {
  @ApiProperty()
  public privateKey: string;
}
