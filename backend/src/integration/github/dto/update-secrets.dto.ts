import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateSecretsBodyDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  public repositoryId: number;
}
