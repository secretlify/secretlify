import * as request from 'supertest';
import { createTestApp, TestApp } from './bootstrap';

describe('ProjectCoreController (reads)', () => {
  let bootstrap: TestApp;

  beforeAll(async () => {
    bootstrap = await createTestApp();
  });

  beforeEach(async () => {
    await bootstrap.methods.beforeEach();
  });

  afterAll(async () => {
    await bootstrap.methods.afterAll();
  });

  describe('GET /projects/:projectId', () => {
    it('gets project when owner', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}`)
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: project.id,
        name: 'test-project',
        members: [{ id: user.id, email: user.email, avatarUrl: user.avatarUrl, role: 'owner' }],
        encryptedSecretsKeys: {},
        encryptedSecrets: '',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('gets project when a member', async () => {
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
        .get(`/projects/${project.id}`)
        .set('authorization', `Bearer ${memberToken}`);

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: project.id,
        name: 'test-project',
        members: [
          { id: owner.id, email: owner.email, avatarUrl: owner.avatarUrl, role: 'owner' },
          { id: member.id, email: member.email, avatarUrl: member.avatarUrl, role: 'member' },
        ],
        encryptedSecretsKeys: {},
        encryptedSecrets: '',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('does not get when not a member', async () => {
      const { token } = await bootstrap.utils.userUtils.createDefault({ email: 'test@test.com' });
      const { token: otherToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'testB@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}`)
        .set('authorization', `Bearer ${otherToken}`);

      // then
      expect(response.status).toEqual(403);
    });

    it('does not get when not logged in', async () => {
      const { token } = await bootstrap.utils.userUtils.createDefault({ email: 'test@test.com' });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer()).get(`/projects/${project.id}`);

      // then
      expect(response.status).toEqual(401);
    });
  });
  describe('GET /users/me/projects', () => {
    it('gets projects for user', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const projectA = await bootstrap.utils.projectUtils.createProject(token, {
        name: 'project-a',
        encryptedSecretsKeys: {},
        encryptedSecrets: '',
      });
      const projectB = await bootstrap.utils.projectUtils.createProject(token, {
        name: 'project-b',
        encryptedSecretsKeys: {},
        encryptedSecrets: '',
      });

      const { token: tokenB } = await bootstrap.utils.userUtils.createDefault({
        email: 'testB@test.com',
      });
      await bootstrap.utils.projectUtils.createProject(tokenB, {
        name: 'project-c',
        encryptedSecretsKeys: {},
        encryptedSecrets: '',
      });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/users/me/projects`)
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: projectA.id,
            name: 'project-a',
            members: [{ id: user.id, email: user.email, avatarUrl: user.avatarUrl, role: 'owner' }],
            encryptedSecretsKeys: {},
            encryptedSecrets: '',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: projectB.id,
            name: 'project-b',
            members: [{ id: user.id, email: user.email, avatarUrl: user.avatarUrl, role: 'owner' }],
            encryptedSecretsKeys: {},
            encryptedSecrets: '',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
      );
    });

    it('returns empty array when no projects', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/users/me/projects`)
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });

    it('does not get when not logged in', async () => {
      // when
      const response = await request(bootstrap.app.getHttpServer()).get(`/users/me/projects`);

      // then
      expect(response.status).toEqual(401);
    });
  });

  describe('GET /projects/:projectId/history', () => {
    it('gets project history', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token, {
        name: 'test-project',
        encryptedSecretsKeys: {},
        encryptedSecrets: 'v1',
      });

      await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('authorization', `Bearer ${token}`)
        .send({ encryptedSecrets: 'v2' });
      await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('authorization', `Bearer ${token}`)
        .send({ encryptedSecrets: 'v3' });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}/history`)
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].encryptedSecrets).toEqual('v3');
      expect(response.body[0].author.id).toEqual(user.id);
      expect(response.body[1].encryptedSecrets).toEqual('v2');
      expect(response.body[1].author.id).toEqual(user.id);
    });
  });
});
