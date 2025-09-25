import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAccessibleRepositoriesQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public name: string = '';
}

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
  public url: string;
  @ApiProperty()
  public isPrivate: boolean;
}

// export class GetAccessibleRepositoriesResponseDto {
//   @ApiProperty({ type: RepositoryDto, isArray: true })
//   public repositories: RepositoryDto[];
//   @ApiProperty({ type: BasePagination })
//   public meta: BasePagination;
// }
