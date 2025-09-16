import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class RemoveUserFromBody {
  @ApiProperty()
  @IsObject()
  public newEncryptedKeyVersions: Record<string, string>;
}
