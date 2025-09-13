import { AuthMethod } from '../../core/enum/auth-method.enum';

export class UpdateUserDto {
  id: string;
  authMethod?: AuthMethod;
  email?: string;
  avatarUrl?: string;
}
