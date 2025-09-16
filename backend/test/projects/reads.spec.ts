import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('ProjectCoreController (reads)', () => {
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
        owner: user.id,
        members: [user.id],
        encryptedKeyVersions: {},
        encryptedSecrets: '',
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
        owner: owner.id,
        members: [owner.id, member.id],
        encryptedKeyVersions: {},
        encryptedSecrets: '',
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
        encryptedKeyVersions: {},
        encryptedSecrets: '',
      });
      const projectB = await bootstrap.utils.projectUtils.createProject(token, {
        name: 'project-b',
        encryptedKeyVersions: {},
        encryptedSecrets: '',
      });

      const { token: tokenB } = await bootstrap.utils.userUtils.createDefault({
        email: 'testB@test.com',
      });
      await bootstrap.utils.projectUtils.createProject(tokenB, {
        name: 'project-c',
        encryptedKeyVersions: {},
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
            owner: user.id,
            members: [user.id],
            encryptedKeyVersions: {},
            encryptedSecrets: '',
          },
          {
            id: projectB.id,
            name: 'project-b',
            owner: user.id,
            members: [user.id],
            encryptedKeyVersions: {},
            encryptedSecrets: '',
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
});
