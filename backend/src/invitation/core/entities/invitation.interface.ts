import { ApiProperty } from '@nestjs/swagger';

export class InvitationNormalized {
  public id: string;
  public temporaryPublicKey: string;
  public temporaryPrivateKey: string;
  public temporaryServerPassphrase: string;
}

export class InvitationSerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public temporaryPublicKey: string;

  @ApiProperty()
  public temporaryPrivateKey: string;

  @ApiProperty()
  public temporaryServerPassphrase: string;
}
