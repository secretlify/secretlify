import { UserPartialSerialized } from '../../../user/core/entities/user.interface';

export class SecretsUpdatedEvent {
  public constructor(
    public readonly projectId: string,
    public readonly newEncryptedSecrets: string,
    public readonly user: UserPartialSerialized,
  ) {}
}
