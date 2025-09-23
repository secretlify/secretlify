import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../../../shared/types/role.enum';

export class UpdateMemberRoleBody {
  @ApiProperty({ enum: [Role.Admin, Role.Member] })
  @IsEnum([Role.Admin, Role.Member])
  public role: Role;
}
