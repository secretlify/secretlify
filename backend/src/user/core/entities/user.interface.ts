import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthMethod } from '../enum/auth-method.enum';

export class UserNormalized {
  id: string;
  email: string;
  authMethod?: AuthMethod;
}

export class UserSerialized {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional({ enum: AuthMethod })
  authMethod?: AuthMethod;
}
