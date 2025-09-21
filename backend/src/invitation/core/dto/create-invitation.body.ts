import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateInvitationBody {
  @ApiProperty()
  @IsString()
  public projectId: string;

  @ApiProperty()
  @IsString()
  public temporaryPublicKey: string;

  @ApiProperty()
  @IsString()
  public temporaryPrivateKey: string;

  @ApiProperty()
  @IsString()
  public temporarySecretsKey: string;
}
