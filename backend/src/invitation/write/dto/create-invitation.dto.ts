import { Role } from '../../../shared/types/role.enum';

export class CreateInvitationDto {
  public projectId: string;
  public authorId: string;
  public temporaryPublicKey: string;
  public temporaryPrivateKey: string;
  public temporarySecretsKey: string;
  public role: Role;
}
