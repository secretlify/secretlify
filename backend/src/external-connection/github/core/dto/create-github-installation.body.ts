import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateGithubInstallationBody {
  @ApiProperty()
  @IsNumber()
  githubInstallationId: number;
}
