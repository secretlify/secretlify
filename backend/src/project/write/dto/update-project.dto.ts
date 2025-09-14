export class UpdateProjectDto {
  public encryptedSecrets?: string;
  public encryptedPassphrases?: Record<string, string>;
  public members?: string[];
}
