import { ApiProperty } from '@nestjs/swagger';

export class InvitationNormalized {
  public id: string;
  public projectId: string;
  public authorId: string;
  public temporaryPublicKey: string;
  public temporaryPrivateKey: string;
  public temporarySecretsKey: string;
  public createdAt: Date;
}

export class InvitationSerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public projectId: string;

  @ApiProperty()
  public authorId: string;

  @ApiProperty()
  public temporaryPublicKey: string;

  @ApiProperty()
  public temporaryPrivateKey: string;

  @ApiProperty()
  public temporarySecretsKey: string;

  @ApiProperty()
  public createdAt: string;
}
