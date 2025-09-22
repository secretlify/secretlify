import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthMethod } from '../enum/auth-method.enum';

export class UserPartialNormalized {
  public id: string;
  public email: string;
  public avatarUrl: string;
}

export class UserNormalized extends UserPartialNormalized {
  public authMethod: AuthMethod;
  public publicKey?: string;
  public privateKeyEncrypted?: string;
}

export class UserPartialSerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public avatarUrl: string;
}

export class UserSerialized extends UserPartialSerialized {
  @ApiProperty({ enum: AuthMethod })
  public authMethod: AuthMethod;

  @ApiPropertyOptional()
  public publicKey?: string;

  @ApiPropertyOptional()
  public privateKeyEncrypted?: string;
}
