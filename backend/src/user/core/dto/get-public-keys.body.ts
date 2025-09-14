import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class GetPublicKeysBody {
  @ApiProperty()
  @IsArray()
  @IsMongoId({ each: true })
  public userIds: string[];
}
