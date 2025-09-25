import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateGithubIntegrationDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  public repositoryId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  public installationId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public projectId: string;
}
