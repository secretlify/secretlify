import { ApiProperty } from '@nestjs/swagger';
import { GithubRepository } from '../../client/dto/github-repository.dto';

export interface GithubIntegrationNormalized {
  id: string;
  projectId: string;
  githubRepositoryId: number;
  githubRepositoryPublicKey: string;
  githubRepositoryPublicKeyId: string;
  installationEntityId: string;
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
  installationEntityId: string;

  @ApiProperty()
  repositoryData?: GithubRepository;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
