export class CreateProjectDto {
  public name: string;
  public owner: string;
  public encryptedKeyVersions: Record<string, string>;
  public encryptedSecrets: string;
}
