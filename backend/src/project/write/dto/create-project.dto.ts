export class CreateProjectDto {
  public name: string;
  public owner: string;
  public encryptedServerPassphrases: Record<string, string>;
  public encryptedSecrets: string;
}
