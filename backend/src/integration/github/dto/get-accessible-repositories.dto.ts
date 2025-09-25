import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AccessibleRepositoryDto {
  @ApiProperty()
  public id: number;
  @ApiProperty()
  public name: string;
  @ApiProperty({ example: '<owner>/<repo>' })
  public fullName: string;
  @ApiProperty()
  public owner: string;
  @ApiProperty()
  public avatarUrl: string;
  @ApiProperty()
  public url: string;
  @ApiProperty()
  public isPrivate: boolean;
}
