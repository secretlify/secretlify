import { ApiProperty } from '@nestjs/swagger';

export class GetProjectSecretsResponse {
  @ApiProperty()
  public encryptedSecrets: string;
}
