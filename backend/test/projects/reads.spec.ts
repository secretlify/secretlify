import * as request from 'supertest';
import { createTestApp, TestApp } from '../utils/bootstrap';

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
        members: { [user.id]: 'owner' },
        encryptedKeyVersions: {},
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
        members: { [owner.id]: 'owner', [member.id]: 'member' },
        encryptedKeyVersions: {},
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
            members: { [user.id]: 'owner' },
            encryptedKeyVersions: {},
            encryptedSecrets: '',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: projectB.id,
            name: 'project-b',
            members: { [user.id]: 'owner' },
            encryptedKeyVersions: {},
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

  describe('GET /projects/:projectId/invitations', () => {
    it('gets invitations for project as owner', async () => {
      // given
      const { token, project } = await bootstrap.utils.projectUtils.setupOwner();
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

  describe('GET /projects/:projectId/history', () => {
    it('gets project history', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(token, {
        name: 'test-project',
        encryptedKeyVersions: {},
        encryptedSecrets: '',
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
      expect(response.body).toEqual({
        id: project.id,
        name: 'test-project',
        members: { [user.id]: 'owner' },
        encryptedKeyVersions: {},
        encryptedSecretsHistory: ['v3', 'v2'],
      });
    });
  });
});
