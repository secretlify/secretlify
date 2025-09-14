import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthMethod } from '../enum/auth-method.enum';

export class UserNormalized {
  id: string;
  email: string;
  authMethod: AuthMethod;
  avatarUrl: string;
  publicKey?: string;
  privateKeyEncrypted?: string;
}

export class UserSerialized {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: AuthMethod })
  authMethod: AuthMethod;

  @ApiPropertyOptional()
  avatarUrl: string;

  @ApiPropertyOptional()
  privateKeyEncrypted?: string;

  @ApiPropertyOptional()
  publicKey?: string;
}
