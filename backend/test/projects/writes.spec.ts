import * as request from 'supertest';
import { ENCRYPTED_SECRETS_MAX_LENGTH } from '../../src/shared/constants/validation';
import { createTestApp } from '../utils/bootstrap';

describe('ProjectCoreController (writes)', () => {
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

  describe('POST /projects', () => {
    it('creates project', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post('/projects')
        .set('authorization', `Bearer ${token}`)
        .send({ name: 'test-project', encryptedSecrets: '', encryptedSecretsKeys: {} });

      // then
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'test-project',
        members: [{ id: user.id, email: user.email, avatarUrl: user.avatarUrl, role: 'owner' }],
        encryptedSecretsKeys: {},
        encryptedSecrets: '',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('does not create when not logged in', async () => {
      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post('/projects')
        .send({ name: 'test-project', encryptedSecrets: '', encryptedPassphrase: '' });

      // then
      expect(response.status).toEqual(401);
    });

    it('does not create when encryptedSecrets is too long', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const longSecrets = 'a'.repeat(ENCRYPTED_SECRETS_MAX_LENGTH + 1);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post('/projects')
        .set('authorization', `Bearer ${token}`)
        .send({ name: 'test-project', encryptedSecrets: longSecrets, encryptedSecretsKeys: {} });

      // then
      expect(response.status).toEqual(400);
    });
  });

  describe('PATCH /projects/:projectId', () => {
    it('updates project', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token, {
        name: 'old-name',
        encryptedSecrets: '',
        encryptedSecretsKeys: {},
      });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('authorization', `Bearer ${token}`)
        .send({
          name: 'new-name',
          encryptedSecretsKeys: {
            [user.id]: 'new-passphrase',
          },
          encryptedSecrets: 'new-secrets',
        });

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        id: project.id,
        name: 'new-name',
        encryptedSecretsKeys: {
          [user.id]: 'new-passphrase',
        },
        encryptedSecrets: 'new-secrets',
      });
    });

    it('updates project when a member', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: member, token: memberToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken, {
        name: 'old-name',
        encryptedSecretsKeys: {},
        encryptedSecrets: '',
      });

      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('authorization', `Bearer ${memberToken}`)
        .send({
          name: 'new-name-by-member',
        });

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        id: project.id,
        name: 'new-name-by-member',
      });
    });

    it('does not update when not member', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);
      const { token: tokenB } = await bootstrap.utils.userUtils.createDefault({
        email: 'testB@test.com',
      });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('authorization', `Bearer ${tokenB}`)
        .send({ name: 'new-name' });

      // then
      expect(response.status).toEqual(403);
    });

    it('does not update when not logged in', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .send({ name: 'new-name' });

      // then
      expect(response.status).toEqual(401);
    });

    it('does not update when encryptedSecrets is too long', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);
      const longSecrets = 'a'.repeat(ENCRYPTED_SECRETS_MAX_LENGTH + 1);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('authorization', `Bearer ${token}`)
        .send({ encryptedSecrets: longSecrets });

      // then
      expect(response.status).toEqual(400);
    });
  });

  describe('DELETE /projects/:projectId', () => {
    it('deletes project', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}`)
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.status).toEqual(204);
    });

    it('does not delete when not owner', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);
      const { token: tokenB } = await bootstrap.utils.userUtils.createDefault({
        email: 'testB@test.com',
      });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}`)
        .set('authorization', `Bearer ${tokenB}`);

      // then
      expect(response.status).toEqual(403);
    });

    it('does not delete when a member', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: member, token: memberToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}`)
        .set('authorization', `Bearer ${memberToken}`);

      // then
      expect(response.status).toEqual(403);
    });

    it('does not delete when not logged in', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer()).delete(
        `/projects/${project.id}`,
      );

      // then
      expect(response.status).toEqual(401);
    });
  });

  describe('DELETE /projects/:projectId/members/:memberId', () => {
    it('owner removes a member', async () => {
      // given
      const { user: owner, token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: member } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}/members/${member.id}`)
        .set('authorization', `Bearer ${ownerToken}`);

      // then
      expect(response.status).toEqual(204);
      const updatedProject = await bootstrap.utils.projectUtils.getProject(project.id, ownerToken);
      expect(updatedProject.members).toEqual([
        { id: owner.id, email: owner.email, avatarUrl: owner.avatarUrl, role: 'owner' },
      ]);
    });

    it('member removes themself', async () => {
      // given
      const { user: owner, token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: member, token: memberToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}/members/${member.id}`)
        .set('authorization', `Bearer ${memberToken}`);

      // then
      expect(response.status).toEqual(204);
      const updatedProject = await bootstrap.utils.projectUtils.getProject(project.id, ownerToken);
      expect(updatedProject.members).toEqual([
        { id: owner.id, email: owner.email, avatarUrl: owner.avatarUrl, role: 'owner' },
      ]);
    });

    it('member cannot remove owner', async () => {
      // given
      const { user: owner, token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: member, token: memberToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}/members/${owner.id}`)
        .set('authorization', `Bearer ${memberToken}`);

      // then
      expect(response.status).toEqual(403);
    });

    it('member cannot remove another member', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: memberA, token: memberAToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'memberA@test.com',
      });
      const { user: memberB } = await bootstrap.utils.userUtils.createDefault({
        email: 'memberB@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, memberA.id);
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, memberB.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}/members/${memberB.id}`)
        .set('authorization', `Bearer ${memberAToken}`);

      // then
      expect(response.status).toEqual(403);
    });

    it('random user cannot remove anyone', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const { user: member } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      const { token: randomToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'random@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}/members/${member.id}`)
        .set('authorization', `Bearer ${randomToken}`);

      // then
      expect(response.status).toEqual(403);
    });

    it('does not remove when not logged in', async () => {
      // given
      const { user: member, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer()).delete(
        `/projects/${project.id}/members/${member.id}`,
      );

      // then
      expect(response.status).toEqual(401);
    });
  });
});
