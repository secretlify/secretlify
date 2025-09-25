import { ApiProperty } from '@nestjs/swagger';

export class GithubIntegrationNormalized {
  public id: string;
  public cryptlyProjectId: string;
  public githubRepositoryId: number;
  public repositoryPublicKey: string;
  public repositoryPublicKeyId: string;
  public createdAt: Date;
  public updatedAt: Date;
}

export class GithubIntegrationSerialized {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public cryptlyProjectId: string;
  @ApiProperty()
  public githubRepositoryId: number;
  @ApiProperty()
  public repositoryPublicKey: string;
  @ApiProperty()
  public repositoryPublicKeyId: string;
  @ApiProperty()
  public createdAt: string;
  @ApiProperty()
  public updatedAt: string;
}
