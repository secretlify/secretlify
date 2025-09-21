import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('InvitationCoreController (reads)', () => {
  let bootstrap: Awaited<ReturnType<typeof createTestApp>>;

  beforeAll(async () => {
    bootstrap = await createTestApp();
  });

  beforeEach(async () => {
    await bootstrap.methods.beforeEach();
  });

  afterAll(async () => {
    await bootstrap.methods.afterAll();
  });

  describe('GET /invitations/:id', () => {
    it('gets invitation by id for any authenticated user', async () => {
      // given
      const { user: owner, token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: invitee, token: inviteeToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const { token: otherToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'other@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      const invitation = await bootstrap.utils.invitationUtils.createInvitation(
        ownerToken,
        project.id,
      );

      const expected = {
        id: invitation.id,
        projectId: project.id,
        authorId: owner.id,
        temporaryPublicKey: 'test-public-key',
        temporaryPrivateKey: 'test-private-key',
        temporarySecretsKey: 'test-server-passphrase',
        createdAt: expect.any(String),
      };

      // when
      const ownerResponse = await request(bootstrap.app.getHttpServer())
        .get(`/invitations/${invitation.id}`)
        .set('authorization', `Bearer ${ownerToken}`);
      const inviteeResponse = await request(bootstrap.app.getHttpServer())
        .get(`/invitations/${invitation.id}`)
        .set('authorization', `Bearer ${inviteeToken}`);
      const otherResponse = await request(bootstrap.app.getHttpServer())
        .get(`/invitations/${invitation.id}`)
        .set('authorization', `Bearer ${otherToken}`);

      // then
      expect(ownerResponse.status).toEqual(200);
      expect(ownerResponse.body).toEqual(expected);
      expect(inviteeResponse.status).toEqual(200);
      expect(inviteeResponse.body).toEqual(expected);
      expect(otherResponse.status).toEqual(200);
      expect(otherResponse.body).toEqual(expected);
    });

    it('does not get when not logged in', async () => {
      // given
      const { user: owner, token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: invitee } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      const invitation = await bootstrap.utils.invitationUtils.createInvitation(
        ownerToken,
        project.id,
      );

      // when
      const response = await request(bootstrap.app.getHttpServer()).get(
        `/invitations/${invitation.id}`,
      );

      // then
      expect(response.status).toEqual(401);
    });

    it('returns 404 when not found', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault();

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get('/invitations/60f7eabc1234567890abcdef')
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.status).toEqual(404);
    });
  });
});
