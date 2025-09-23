import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('InvitationCoreController (writes)', () => {
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

  describe('POST /invitations', () => {
    it('creates invitation when project owner', async () => {
      // given
      const { user: owner, token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: invitee } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post('/invitations')
        .set('authorization', `Bearer ${ownerToken}`)
        .send({
          projectId: project.id,
          temporaryPublicKey: 'test-public-key',
          temporaryPrivateKey: 'test-private-key',
          temporarySecretsKey: 'test-secrets-key',
        });

      // then
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        projectId: project.id,
        author: {
          id: owner.id,
          email: owner.email,
          avatarUrl: owner.avatarUrl,
        },
        temporaryPublicKey: 'test-public-key',
        temporaryPrivateKey: 'test-private-key',
        temporarySecretsKey: 'test-secrets-key',
        createdAt: expect.any(String),
      });
    });

    it('does not create invitation when not project owner', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: invitee } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const { token: otherToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'other@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post('/invitations')
        .set('authorization', `Bearer ${otherToken}`)
        .send({
          projectId: project.id,
          temporaryPublicKey: 'test-public-key',
          temporaryPrivateKey: 'test-private-key',
          temporarySecretsKey: 'test-secrets-key',
        });

      // then
      expect(response.status).toEqual(401);
    });

    it('does not create invitation when a member but not owner', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: member, token: memberToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      const { user: invitee } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post('/invitations')
        .set('authorization', `Bearer ${memberToken}`)
        .send({
          projectId: project.id,
          temporaryPublicKey: 'test-public-key',
          temporaryPrivateKey: 'test-private-key',
          temporarySecretsKey: 'test-secrets-key',
        });

      // then
      expect(response.status).toEqual(401);
    });

    it('does not create when not logged in', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: invitee } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);

      // when
      const response = await request(bootstrap.app.getHttpServer()).post('/invitations').send({
        projectId: project.id,
        temporaryPublicKey: 'test-public-key',
        temporaryPrivateKey: 'test-private-key',
        temporarySecretsKey: 'test-secrets-key',
      });

      // then
      expect(response.status).toEqual(401);
    });
  });

  describe('POST /invitations/:id/accept', () => {
    it('accepts invitation and adds user to project', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: invitee, token: inviteeToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      const invitation = await bootstrap.utils.invitationUtils.createInvitation(
        ownerToken,
        project.id,
      );

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post(`/invitations/${invitation.id}/accept`)
        .set('authorization', `Bearer ${inviteeToken}`)
        .send({ newSecretsKey: 'passphrase' });

      // then
      expect(response.status).toEqual(201);

      const updatedProject = await bootstrap.utils.projectUtils.getProject(
        project.id,
        inviteeToken,
      );

      expect(updatedProject.members).toContainEqual({
        id: invitee.id,
        email: invitee.email,
        avatarUrl: invitee.avatarUrl,
        role: 'member',
      });
    });

    it('can read secrets after adding member', async () => {
      // given
      const { user: owner, token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: invitee, token: inviteeToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });

      const project = await bootstrap.utils.projectUtils.createProject(ownerToken, {
        encryptedSecrets: 'passphrase',
        encryptedSecretsKeys: { [owner.id]: 'owner-passphrase' },
        name: 'test-project',
      });
      const invitation = await bootstrap.utils.invitationUtils.createInvitation(
        ownerToken,
        project.id,
      );

      // when
      await request(bootstrap.app.getHttpServer())
        .post(`/invitations/${invitation.id}/accept`)
        .set('authorization', `Bearer ${inviteeToken}`)
        .send({ newSecretsKey: 'invitee-passphrase' });
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}`)
        .set('authorization', `Bearer ${ownerToken}`);

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        encryptedSecrets: 'passphrase',
        encryptedSecretsKeys: {
          [owner.id]: 'owner-passphrase',
          [invitee.id]: 'invitee-passphrase',
        },
      });
    });

    it('does not accept invitation twice', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { token: inviteeToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const { token: otherInviteeToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'other-invitee@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      const invitation = await bootstrap.utils.invitationUtils.createInvitation(
        ownerToken,
        project.id,
      );
      await request(bootstrap.app.getHttpServer())
        .post(`/invitations/${invitation.id}/accept`)
        .set('authorization', `Bearer ${inviteeToken}`)
        .send({ newSecretsKey: 'encryptedSecretsKey' });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post(`/invitations/${invitation.id}/accept`)
        .set('authorization', `Bearer ${otherInviteeToken}`)
        .send({ newSecretsKey: 'encryptedSecretsKey' });

      // then
      expect(response.status).toEqual(404);
    });

    it('does not accept when not logged in', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
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
      const response = await request(bootstrap.app.getHttpServer())
        .post(`/invitations/${invitation.id}/accept`)
        .send({ newSecretsKey: 'encryptedSecretsKey' });

      // then
      expect(response.status).toEqual(401);
    });

    it('returns 404 if invitation not found', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault();

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post(`/invitations/60f7eabc1234567890abcdef/accept`)
        .set('authorization', `Bearer ${token}`)
        .send({ newSecretsKey: 'encryptedSecretsKey' });

      // then
      expect(response.status).toEqual(404);
    });
  });

  describe('DELETE /invitations/:id', () => {
    it('revokes invitation when project owner', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { token: inviteeToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      const invitation = await bootstrap.utils.invitationUtils.createInvitation(
        ownerToken,
        project.id,
      );
      await request(bootstrap.app.getHttpServer())
        .delete(`/invitations/${invitation.id}`)
        .set('authorization', `Bearer ${ownerToken}`);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/invitations/${invitation.id}`)
        .set('authorization', `Bearer ${inviteeToken}`);

      // then
      expect(response.status).toEqual(404);
    });

    it('does not revoke invitation when not project owner', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: invitee } = await bootstrap.utils.userUtils.createDefault({
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

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/invitations/${invitation.id}`)
        .set('authorization', `Bearer ${otherToken}`);

      // then
      expect(response.status).toEqual(401);
    });

    it('does not revoke when a member but not owner', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: member, token: memberToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      const { user: invitee } = await bootstrap.utils.userUtils.createDefault({
        email: 'invitee@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);
      const invitation = await bootstrap.utils.invitationUtils.createInvitation(
        ownerToken,
        project.id,
      );

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/invitations/${invitation.id}`)
        .set('authorization', `Bearer ${memberToken}`);

      // then
      expect(response.status).toEqual(401);
    });

    it('does not revoke when not logged in', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
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
      const response = await request(bootstrap.app.getHttpServer()).delete(
        `/invitations/${invitation.id}`,
      );

      // then
      expect(response.status).toEqual(401);
    });
  });
});
