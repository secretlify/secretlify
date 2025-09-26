export class UpdateProjectDto {
  public name?: string;
  public encryptedSecrets?: string;
  public encryptedSecretsKeys?: Record<string, string>;

  // integrations
  public githubInstallationId?: number | null;
}
