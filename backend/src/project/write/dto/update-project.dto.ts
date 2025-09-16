export class UpdateProjectDto {
  public name?: string;
  public encryptedSecrets?: string;
  public encryptedKeyVersions?: Record<string, string>;
}
