import { ApiProperty } from '@nestjs/swagger';

export class GetGithubInstallationDto {
  @ApiProperty()
  public owner: string;
  @ApiProperty()
  public avatar: string;
}
