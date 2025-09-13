import { ApiProperty } from '@nestjs/swagger';

export class GithubLoginBody {
  @ApiProperty()
  githubCode: string;

  forceLocalLogin?: boolean;
}
