import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateGithubIntegrationBody {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  public repositoryId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public installationEntityId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public projectId: string;
}
