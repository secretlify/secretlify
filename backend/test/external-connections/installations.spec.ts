import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';
import { githubExternalConnectionClientMock } from '../utils/mocks/github-client-mock';
import { GithubExternalConnectionClientService } from '../../src/external-connection/github/client/github-external-connection-client.service';

describe('GithubExternalConnectionCoreController (installations)', () => {
  let bootstrap: Awaited<ReturnType<typeof createTestApp>>;
  let clientMock: jest.Mocked<GithubExternalConnectionClientService>;

  beforeAll(async () => {
    bootstrap = await createTestApp();
  });

  beforeEach(async () => {
    await bootstrap.methods.beforeEach();
    clientMock = bootstrap.app.get(GithubExternalConnectionClientService);
  });

  afterAll(async () => {
    await bootstrap.methods.afterAll();
  });

  describe('POST /users/me/external-connections/github/installations', () => {
    it('creates a new GitHub installation', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();
      const githubInstallationId = 123456;

      const response = await request(bootstrap.app.getHttpServer())
        .post('/users/me/external-connections/github/installations')
        .set('authorization', `Bearer ${setup.token}`)
        .send({ githubInstallationId });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        userId: setup.user.id,
        githubInstallationId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('returns 409 if installation already exists', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();
      const githubInstallationId = 123456;

      await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setup.token,
        githubInstallationId,
      );

      const response = await request(bootstrap.app.getHttpServer())
        .post('/users/me/external-connections/github/installations')
        .set('authorization', `Bearer ${setup.token}`)
        .send({ githubInstallationId });

      expect(response.status).toEqual(409);
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(bootstrap.app.getHttpServer())
        .post('/users/me/external-connections/github/installations')
        .send({ githubInstallationId: 123456 });

      expect(response.status).toEqual(401);
    });
  });

  describe('GET /users/me/external-connections/github/installations', () => {
    it('returns current user installations', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();

      clientMock.getInstallationByGithubInstallationId.mockResolvedValue({
        id: 123456,
        owner: 'test-owner',
        avatar: 'https://github.com/test-avatar.png',
      });

      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setup.token,
        123456,
      );

      const response = await request(bootstrap.app.getHttpServer())
        .get('/users/me/external-connections/github/installations')
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual({
        id: installation.id,
        userId: setup.user.id,
        githubInstallationId: 123456,
        liveData: {
          id: 123456,
          owner: 'test-owner',
          avatar: 'https://github.com/test-avatar.png',
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('returns empty array if no installations', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();

      const response = await request(bootstrap.app.getHttpServer())
        .get('/users/me/external-connections/github/installations')
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(bootstrap.app.getHttpServer()).get(
        '/users/me/external-connections/github/installations',
      );

      expect(response.status).toEqual(401);
    });
  });

  describe('GET /external-connections/github/installations/:installationEntityId', () => {
    it('returns installation by id', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();

      clientMock.getInstallationByGithubInstallationId.mockResolvedValue({
        id: 123456,
        owner: 'test-owner',
        avatar: 'https://github.com/test-avatar.png',
      });

      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setup.token,
        123456,
      );

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/external-connections/github/installations/${installation.id}`)
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: installation.id,
        userId: setup.user.id,
        githubInstallationId: 123456,
        liveData: {
          id: 123456,
          owner: 'test-owner',
          avatar: 'https://github.com/test-avatar.png',
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('returns 404 if installation not found', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();

      const response = await request(bootstrap.app.getHttpServer())
        .get('/external-connections/github/installations/60f7eabc1234567890abcdef')
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(404);
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(bootstrap.app.getHttpServer()).get(
        '/external-connections/github/installations/60f7eabc1234567890abcdef',
      );

      expect(response.status).toEqual(401);
    });
  });

  describe('GET /external-connections/github/installations/:installationEntityId/repositories', () => {
    it('returns repositories available for installation', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();

      const repositories = [
        {
          id: 1,
          owner: 'test-owner',
          avatarUrl: 'https://github.com/avatar1.png',
          name: 'repo1',
          url: 'https://github.com/test-owner/repo1',
          isPrivate: false,
        },
        {
          id: 2,
          owner: 'test-owner',
          avatarUrl: 'https://github.com/avatar2.png',
          name: 'repo2',
          url: 'https://github.com/test-owner/repo2',
          isPrivate: true,
        },
      ];

      clientMock.getRepositoriesAvailableForInstallation.mockResolvedValue(repositories);

      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setup.token,
        123456,
      );

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/external-connections/github/installations/${installation.id}/repositories`)
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(repositories);
    });

    it('returns 404 if installation not found', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();

      const response = await request(bootstrap.app.getHttpServer())
        .get('/external-connections/github/installations/60f7eabc1234567890abcdef/repositories')
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(404);
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(bootstrap.app.getHttpServer()).get(
        '/external-connections/github/installations/60f7eabc1234567890abcdef/repositories',
      );

      expect(response.status).toEqual(401);
    });
  });

  describe('GET /external-connections/github/installations/:installationEntityId/access-token', () => {
    it('returns installation access token', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();

      clientMock.getInstallationAccessToken.mockResolvedValue('test-access-token');

      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setup.token,
        123456,
      );

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/external-connections/github/installations/${installation.id}/access-token`)
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        token: 'test-access-token',
      });
    });

    it('returns 404 if installation not found', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();

      const response = await request(bootstrap.app.getHttpServer())
        .get('/external-connections/github/installations/60f7eabc1234567890abcdef/access-token')
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(404);
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(bootstrap.app.getHttpServer()).get(
        '/external-connections/github/installations/60f7eabc1234567890abcdef/access-token',
      );

      expect(response.status).toEqual(401);
    });
  });
});
