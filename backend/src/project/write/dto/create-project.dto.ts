export class CreateProjectDto {
  public name: string;
  public owner: string;
  public encryptedPassphrases: Record<string, string>;
  public encryptedSecrets: Record<string, string>;
}
