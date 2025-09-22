import { ApiProperty } from '@nestjs/swagger';
import { UserPartialSerialized } from 'src/user/core/entities/user.interface';

export class ProjectSecretsVersionNormalized {
  public id: string;
  public projectId: string;
  public authorId: string | undefined;
  public encryptedSecrets: string;
  public createdAt: Date;
  public updatedAt: Date;
}

export class ProjectSecretsVersionSerialized {
  @ApiProperty()
  public id: string;

  @ApiProperty({ type: UserPartialSerialized })
  public author: UserPartialSerialized;

  @ApiProperty()
  public encryptedSecrets: string;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updatedAt: string;
}
