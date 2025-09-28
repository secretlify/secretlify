import { ApiProperty } from '@nestjs/swagger';

export class GithubInstallationNormalized {
  id: string;
  userId: string;
  githubInstallationId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class GithubInstallationLiveDataSerialized {
  @ApiProperty()
  owner: string;

  @ApiProperty()
  avatar: string;
}

export class GithubInstallationSerialized {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  githubInstallationId: number;

  @ApiProperty({ type: GithubInstallationLiveDataSerialized })
  liveData?: GithubInstallationLiveDataSerialized;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
