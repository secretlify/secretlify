export class CreateProjectDto {
  public name: string;
  public owner: string;
  public encryptedPassphrase: string;
  public encryptedSecrets: string;
}
