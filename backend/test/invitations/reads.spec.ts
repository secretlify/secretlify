import * as request from 'supertest';
import { Role } from '../../src/shared/types/role.enum';
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
        author: {
          id: owner.id,
          email: owner.email,
          avatarUrl: owner.avatarUrl,
        },
        role: Role.Member,
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

  describe('GET /projects/:projectId/invitations', () => {
    it('gets invitations for project as owner', async () => {
      // given
      const { user, token, project } = await bootstrap.utils.projectUtils.setupOwner();
      const invitationA = await bootstrap.utils.invitationUtils.createInvitation(token, project.id);
      const invitationB = await bootstrap.utils.invitationUtils.createInvitation(token, project.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}/invitations`)
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.map((i) => i.id).sort()).toEqual(
        [invitationA.id, invitationB.id].sort(),
      );
      expect(response.body[0].author).toEqual({
        id: user.id,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    });

    it('returns empty array when no invitations', async () => {
      // given
      const { token, project } = await bootstrap.utils.projectUtils.setupOwner();

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}/invitations`)
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });

    it('returns 403 when user is not an owner', async () => {
      // given
      const { project, token: memberToken } = await bootstrap.utils.projectUtils.setupMember();

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}/invitations`)
        .set('authorization', `Bearer ${memberToken}`);

      // then
      expect(response.status).toEqual(403);
    });

    it('returns 403 when user is not a project member', async () => {
      // given
      const { project } = await bootstrap.utils.projectUtils.setupOwner();
      const { token: tokenB } = await bootstrap.utils.userUtils.createDefault();

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}/invitations`)
        .set('authorization', `Bearer ${tokenB}`);

      // then
      expect(response.status).toEqual(403);
    });

    it('returns 401 when not logged in', async () => {
      // given
      const { project } = await bootstrap.utils.projectUtils.setupOwner();

      // when
      const response = await request(bootstrap.app.getHttpServer()).get(
        `/projects/${project.id}/invitations`,
      );

      // then
      expect(response.status).toEqual(401);
    });
  });
});
