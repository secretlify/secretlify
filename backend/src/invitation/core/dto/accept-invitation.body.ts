import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AcceptInvitationBody {
  @ApiProperty()
  @IsString()
  public newSecretsKey: string;
}
