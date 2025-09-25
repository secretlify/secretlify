import { ApiProperty } from '@nestjs/swagger';

export interface GithubRepository {
  id: number;
  owner: string;
  avatarUrl: string;
  name: string;
  url: string;
  isPrivate: boolean;
}

export class GithubRepositorySerialized {
  @ApiProperty()
  id: number;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  isPrivate: boolean;
}
