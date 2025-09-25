import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetGithubIntegrationsDto {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public projectId: string;
  @ApiProperty()
  public repositoryId: number;
  @ApiProperty()
  public publicKey: string;
  @ApiProperty()
  public publicKeyId: string;
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public owner: string;
  @ApiProperty()
  public fullName: string;
}
