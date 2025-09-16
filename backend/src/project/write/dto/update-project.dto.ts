export class UpdateProjectDto {
  public name?: string;
  public encryptedSecrets?: string;
  public encryptedServerPassphrases?: Record<string, string>;
}
