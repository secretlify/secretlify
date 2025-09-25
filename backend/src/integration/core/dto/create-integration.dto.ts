import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IntegrationType } from 'src/integration/core/enums/integration-type.enum';

export class CreateIntegrationDto {
  @ApiProperty({ enum: IntegrationType, default: IntegrationType.Github, required: false })
  @IsOptional()
  @IsEnum(IntegrationType)
  @IsNotEmpty()
  public type: IntegrationType = IntegrationType.Github;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public projectId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public repositoryId: string;
}
