import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateInvitationBody } from '../../src/invitation/core/dto/create-invitation.body';
import { InvitationSerialized } from '../../src/invitation/core/entities/invitation.interface';
import { Role } from '../../src/shared/types/role.enum';

interface CreateInvitation {
  projectId: string;
  email: string;
  authorId: string;
}
export class InvitationUtils {
  constructor(private readonly app: INestApplication) {}

  public async createInvitation(
    token: string,
    projectId: string,
    data: Partial<CreateInvitationBody> = {},
  ): Promise<InvitationSerialized> {
    const response = await request(this.app.getHttpServer())
      .post('/invitations')
      .set('authorization', `Bearer ${token}`)
      .send({
        temporaryPublicKey: 'test-public-key',
        temporaryPrivateKey: 'test-private-key',
        temporarySecretsKey: 'test-server-passphrase',
        role: Role.Member,
        ...data,
        projectId,
      });

    return response.body;
  }
}
