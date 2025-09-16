export class CreateInvitationDto {
  public projectId: string;
  public authorId: string;
  public temporaryPublicKey: string;
  public temporaryPrivateKey: string;
  public temporaryServerPassphrase: string;
}
