export class CreateProjectDto {
  public name: string;
  public encryptedKeyVersions: Record<string, string>;
  public encryptedSecrets: string;
}
