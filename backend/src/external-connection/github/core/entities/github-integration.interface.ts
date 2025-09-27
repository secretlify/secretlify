import { ApiProperty } from '@nestjs/swagger';

export interface GithubIntegrationNormalized {
  id: string;
  projectId: string;
  githubRepositoryId: number;
  githubRepositoryPublicKey: string;
  githubRepositoryPublicKeyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GithubIntegrationSerialized {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  githubRepositoryId: number;

  @ApiProperty()
  githubRepositoryPublicKey: string;

  @ApiProperty()
  githubRepositoryPublicKeyId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
