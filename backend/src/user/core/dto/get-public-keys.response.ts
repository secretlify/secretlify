import { ApiProperty } from '@nestjs/swagger';

export class GetPublicKeysResponse {
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  public publicKeys: Record<string, string>;
}
