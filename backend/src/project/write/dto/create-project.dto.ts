export class CreateProjectDto {
  public name: string;
  public encryptedSecretsKeys: Record<string, string>;
  public encryptedSecrets: string;
}
