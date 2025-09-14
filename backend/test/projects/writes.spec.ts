import * as request from 'supertest';
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
        .send({ name: 'test-project' });

      // then
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'test-project',
        owner: user.id,
        members: [user.id],
        encryptedPassphrases: {},
        encryptedSecrets: null,
      });
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

  describe('PUT /projects/:projectId/secrets', () => {
    it('adds secrets to project', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .put(`/projects/${project.id}/secrets`)
        .set('authorization', `Bearer ${token}`)
        .send({ encryptedSecrets: 'test-secrets' });

      // then
      expect(response.status).toEqual(200);
      expect(response.body.encryptedSecrets).toEqual('test-secrets');
    });

    it('updates secrets in project', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);
      await request(bootstrap.app.getHttpServer())
        .put(`/projects/${project.id}/secrets`)
        .set('authorization', `Bearer ${token}`)
        .send({ encryptedSecrets: 'test-secrets' });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .put(`/projects/${project.id}/secrets`)
        .set('authorization', `Bearer ${token}`)
        .send({ encryptedSecrets: 'new-secrets' });

      // then
      expect(response.status).toEqual(200);
      expect(response.body.encryptedSecrets).toEqual('new-secrets');
    });

    it('does not add secrets when not member', async () => {
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
        .put(`/projects/${project.id}/secrets`)
        .set('authorization', `Bearer ${tokenB}`)
        .send({ encryptedSecrets: 'test-secrets' });

      // then
      expect(response.status).toEqual(403);
    });

    it('does not add secrets when not logged in', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .put(`/projects/${project.id}/secrets`)
        .send({ encryptedSecrets: 'test-secrets' });

      // then
      expect(response.status).toEqual(401);
    });
  });

  describe('PUT /projects/:projectId/members/:userId', () => {
    it('removes user from project', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const { user: userB } = await bootstrap.utils.userUtils.createDefault({
        email: 'testB@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .put(`/projects/${project.id}/members/${userB.id}`)
        .set('authorization', `Bearer ${token}`)
        .send({ newEncryptedPassphrases: {} });

      // then
      expect(response.status).toEqual(200);
      expect(response.body.members).toEqual([user.id]);
    });

    it('does not remove user from project when not owner', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const { user: userB, token: tokenB } = await bootstrap.utils.userUtils.createDefault({
        email: 'testB@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .put(`/projects/${project.id}/members/${userB.id}`)
        .set('authorization', `Bearer ${tokenB}`)
        .send({ newEncryptedPassphrases: {} });

      // then
      expect(response.status).toEqual(403);
    });

    it('does not remove user from project when not logged in', async () => {
      // given
      const { token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const { user: userB } = await bootstrap.utils.userUtils.createDefault({
        email: 'testB@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .put(`/projects/${project.id}/members/${userB.id}`)
        .send({ newEncryptedPassphrases: {} });

      // then
      expect(response.status).toEqual(401);
    });
  });
});
