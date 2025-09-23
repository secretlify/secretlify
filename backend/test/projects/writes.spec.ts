import { advanceBy, advanceTo } from 'jest-date-mock';
import { firstValueFrom, of } from 'rxjs';
import { catchError, take, timeout, toArray } from 'rxjs/operators';
import * as request from 'supertest';
import { ProjectCoreController } from '../../src/project/core/project-core.controller';
import { ENCRYPTED_SECRETS_MAX_LENGTH } from '../../src/shared/constants/validation';
import { Role } from '../../src/shared/types/role.enum';
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

    it('project is updated when secrets change', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      // set current time
      advanceTo('2025-09-23T00:00:00.000Z');
      const project = await bootstrap.utils.projectUtils.createProject(token);

      // when
      advanceBy(3600 * 1000); // 1 hour
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('authorization', `Bearer ${token}`)
        .send({ encryptedSecrets: 'new-secrets' });

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: project.id,
        name: 'test-project',
        members: [{ id: user.id, email: user.email, avatarUrl: user.avatarUrl, role: 'owner' }],
        encryptedSecretsKeys: {},
        encryptedSecrets: 'new-secrets',
        createdAt: expect.any(String),
        updatedAt: '2025-09-23T01:00:00.000Z',
      });
    });
  });

  describe('PATCH /projects/:projectId/members/:memberId', () => {
    it('owner updates a member to admin', async () => {
      // given
      const {
        user: owner,
        token: ownerToken,
        project,
      } = await bootstrap.utils.projectUtils.setupOwner();
      const { user: member } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}/members/${member.id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .send({ role: Role.Admin });

      // then
      expect(response.status).toEqual(204);
      const updatedProject = await bootstrap.utils.projectUtils.getProject(project.id, ownerToken);
      expect(updatedProject.members).toEqual([
        { id: owner.id, email: owner.email, avatarUrl: owner.avatarUrl, role: 'owner' },
        { id: member.id, email: member.email, avatarUrl: member.avatarUrl, role: 'admin' },
      ]);
    });

    it('owner cannot update a member to owner', async () => {
      // given
      const {
        member,
        token: ownerToken,
        project,
      } = await bootstrap.utils.projectUtils.setupMember();

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}/members/${member.id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .send({ role: Role.Owner });

      // then
      expect(response.status).toEqual(403);
    });

    it('admin cannot update a member to admin', async () => {
      // given
      const { admin, token: adminToken, project } = await bootstrap.utils.projectUtils.setupAdmin();
      const { user: member } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}/members/${admin.id}`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ role: Role.Admin });

      // then
      expect(response.status).toEqual(403);
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

    it('admin removes a member', async () => {
      // given
      const {
        owner,
        admin,
        token: adminToken,
        project,
      } = await bootstrap.utils.projectUtils.setupAdmin();
      const { user: member } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}/members/${member.id}`)
        .set('authorization', `Bearer ${adminToken}`);

      // then
      expect(response.status).toEqual(204);
      const updatedProject = await bootstrap.utils.projectUtils.getProject(project.id, adminToken);
      expect(updatedProject.members).toEqual([
        { id: owner.id, email: owner.email, avatarUrl: owner.avatarUrl, role: 'owner' },
        { id: admin.id, email: admin.email, avatarUrl: admin.avatarUrl, role: 'admin' },
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

    it('member cannot remove admin', async () => {
      // given
      const { admin, token: adminToken, project } = await bootstrap.utils.projectUtils.setupAdmin();
      const { user: member, token: memberToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'member@test.com',
      });
      await bootstrap.utils.projectUtils.addMemberToProject(project.id, member.id);

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/projects/${project.id}/members/${admin.id}`)
        .set('authorization', `Bearer ${memberToken}`);

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

  describe('GET /projects/:projectId/events', () => {
    it('receives secrets updates events for the specified project', async () => {
      // given
      const { user, token, project } = await bootstrap.utils.projectUtils.setupOwner();
      const projectCoreController = bootstrap.app.get(ProjectCoreController);

      // when
      const stream = await projectCoreController.streamEvents(project.id);
      const resultsPromise = firstValueFrom(stream.pipe(take(2), toArray()));

      await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('authorization', `Bearer ${token}`)
        .send({
          encryptedSecrets: 'new-secrets-for-sse',
        });

      await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('authorization', `Bearer ${token}`)
        .send({
          encryptedSecrets: 'new-secrets-for-sse-2',
        });

      // then
      const results = await resultsPromise;

      expect(results[0].data).toMatchObject({
        newEncryptedSecrets: 'new-secrets-for-sse',
        user: {
          id: user.id,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      });

      expect(results[1].data).toMatchObject({
        newEncryptedSecrets: 'new-secrets-for-sse-2',
        user: {
          id: user.id,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      });
    });

    it('does not receive secrets updates events for other projects', async () => {
      // given
      const { project: projectA } = await bootstrap.utils.projectUtils.setupOwner();
      const { token: tokenB, project: projectB } = await bootstrap.utils.projectUtils.setupOwner();

      const projectCoreController = bootstrap.app.get(ProjectCoreController);

      const streamA = await projectCoreController.streamEvents(projectA.id);
      const resultsPromiseA = firstValueFrom(
        streamA.pipe(
          take(1),
          timeout(1000),
          catchError(() => of(null)),
        ),
      );

      // when
      await request(bootstrap.app.getHttpServer())
        .patch(`/projects/${projectB.id}`)
        .set('authorization', `Bearer ${tokenB}`)
        .send({
          encryptedSecrets: 'new-secrets-for-sse',
        });

      // then
      const result = await resultsPromiseA;
      expect(result).toBeNull();
    });

    it('does not receive secrets when not logged in', async () => {
      // given
      const { project } = await bootstrap.utils.projectUtils.setupOwner();

      // when
      const response = await request(bootstrap.app.getHttpServer()).get(
        `/projects/${project.id}/events`,
      );

      // then
      expect(response.status).toEqual(401);
    });
  });
});
