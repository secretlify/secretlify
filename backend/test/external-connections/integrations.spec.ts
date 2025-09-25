import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';
import { githubExternalConnectionClientMock } from '../utils/mocks/github-client-mock';
import { GithubExternalConnectionClientService } from '../../src/external-connection/github/client/github-external-connection-client.service';
import { Role } from '../../src/shared/types/role.enum';

describe('GithubExternalConnectionCoreController (integrations)', () => {
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

  describe('POST /external-connections/github/integrations', () => {
    it('creates a new GitHub integration', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setup.token);
      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setup.token,
        123456,
      );

      clientMock.getRepositoryInfoByInstallationIdAndRepositoryId.mockResolvedValue({
        id: 789,
        owner: 'test-owner',
        name: 'test-repo',
        avatarUrl: 'https://github.com/avatar.png',
        url: 'https://github.com/test-owner/test-repo',
        isPrivate: false,
      });

      clientMock.getRepositoryPublicKey.mockResolvedValue({
        key: 'test-public-key',
        keyId: 'test-key-id',
      });

      const response = await request(bootstrap.app.getHttpServer())
        .post('/external-connections/github/integrations')
        .set('authorization', `Bearer ${setup.token}`)
        .send({
          repositoryId: 789,
          installationEntityId: installation.id,
          projectId: project.id,
        });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        projectId: project.id,
        githubRepositoryId: 789,
        githubRepositoryPublicKey: 'test-public-key',
        githubRepositoryPublicKeyId: 'test-key-id',
        installationEntityId: installation.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('returns 409 if integration already exists for the project', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setup.token);
      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setup.token,
        123456,
      );

      clientMock.getRepositoryInfoByInstallationIdAndRepositoryId.mockResolvedValue({
        id: 789,
        owner: 'test-owner',
        name: 'test-repo',
        avatarUrl: 'https://github.com/avatar.png',
        url: 'https://github.com/test-owner/test-repo',
        isPrivate: false,
      });

      clientMock.getRepositoryPublicKey.mockResolvedValue({
        key: 'test-public-key',
        keyId: 'test-key-id',
      });

      const integration = await bootstrap.utils.githubExternalConnectionUtils.createIntegration(
        setup.token,
        {
          repositoryId: 789,
          installationEntityId: installation.id,
          projectId: project.id,
        },
      );

      const response = await request(bootstrap.app.getHttpServer())
        .post('/external-connections/github/integrations')
        .set('authorization', `Bearer ${setup.token}`)
        .send({
          repositoryId: 789,
          installationEntityId: installation.id,
          projectId: project.id,
        });

      expect(response.status).toEqual(409);
    });

    it('returns 404 if installation not found', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setup.token);

      const response = await request(bootstrap.app.getHttpServer())
        .post('/external-connections/github/integrations')
        .set('authorization', `Bearer ${setup.token}`)
        .send({
          repositoryId: 789,
          installationEntityId: '60f7eabc1234567890abcdef',
          projectId: project.id,
        });

      expect(response.status).toEqual(404);
    });

    it('returns 403 if user is not a project member', async () => {
      const setupA = await bootstrap.utils.userUtils.createDefault();
      const setupB = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setupA.token);

      const response = await request(bootstrap.app.getHttpServer())
        .post('/external-connections/github/integrations')
        .set('authorization', `Bearer ${setupB.token}`)
        .send({
          repositoryId: 789,
          installationEntityId: '60f7eabc1234567890abcdef',
          projectId: project.id,
        });

      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual('You are not a member of this project');
    });

    it('returns 403 if user is not a project owner or admin', async () => {
      const setupA = await bootstrap.utils.userUtils.createDefault();
      const setupB = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setupA.token);
      await bootstrap.utils.projectUtils.addMemberToProject(
        project.id,
        setupB.user.id,
        Role.Member,
      );

      const response = await request(bootstrap.app.getHttpServer())
        .post('/external-connections/github/integrations')
        .set('authorization', `Bearer ${setupB.token}`)
        .send({
          repositoryId: 789,
          installationEntityId: '60f7eabc1234567890abcdef',
          projectId: project.id,
        });

      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual('You are not the owner or admin of this project');
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(bootstrap.app.getHttpServer())
        .post('/external-connections/github/integrations')
        .send({
          repositoryId: 789,
          installationEntityId: '60f7eabc1234567890abcdef',
          projectId: '60f7eabc1234567890abcdef',
        });

      expect(response.status).toEqual(401);
    });
  });

  describe('GET /projects/:projectId/external-connections/github/integrations', () => {
    it('returns integrations for a project', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setup.token);
      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setup.token,
        123456,
      );

      githubExternalConnectionClientMock.getRepositoryInfoByInstallationIdAndRepositoryId
        .mockResolvedValueOnce({
          id: 789,
          owner: 'test-owner',
          name: 'test-repo',
        })
        .mockResolvedValueOnce({
          id: 789,
          owner: 'test-owner',
          name: 'test-repo',
          avatarUrl: 'https://github.com/avatar.png',
          url: 'https://github.com/test-owner/test-repo',
          isPrivate: false,
        });

      githubExternalConnectionClientMock.getRepositoryPublicKey.mockResolvedValue({
        key: 'test-public-key',
        keyId: 'test-key-id',
      });

      const integration = await bootstrap.utils.githubExternalConnectionUtils.createIntegration(
        setup.token,
        {
          repositoryId: 789,
          installationEntityId: installation.id,
          projectId: project.id,
        },
      );

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}/external-connections/github/integrations`)
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual({
        id: integration.id,
        projectId: project.id,
        githubRepositoryId: 789,
        githubRepositoryPublicKey: 'test-public-key',
        githubRepositoryPublicKeyId: 'test-key-id',
        installationEntityId: installation.id,
        repositoryData: {
          id: 789,
          owner: 'test-owner',
          name: 'test-repo',
          avatarUrl: 'https://github.com/avatar.png',
          url: 'https://github.com/test-owner/test-repo',
          isPrivate: false,
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('returns empty array if no integrations', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setup.token);

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}/external-connections/github/integrations`)
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });

    it('returns 403 when user is not a project member', async () => {
      const setupA = await bootstrap.utils.userUtils.createDefault();
      const setupB = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setupA.token);

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}/external-connections/github/integrations`)
        .set('authorization', `Bearer ${setupB.token}`);

      expect(response.status).toEqual(403);
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(bootstrap.app.getHttpServer()).get(
        '/projects/60f7eabc1234567890abcdef/external-connections/github/integrations',
      );

      expect(response.status).toEqual(401);
    });
  });

  describe('DELETE /external-connections/github/integrations/:integrationId', () => {
    it('deletes a GitHub integration', async () => {
      const setup = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setup.token);
      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setup.token,
        123456,
      );

      githubExternalConnectionClientMock.getRepositoryInfoByInstallationIdAndRepositoryId.mockResolvedValue(
        {
          id: 789,
          owner: 'test-owner',
          name: 'test-repo',
        },
      );

      githubExternalConnectionClientMock.getRepositoryPublicKey.mockResolvedValue({
        key: 'test-public-key',
        keyId: 'test-key-id',
      });

      const integration = await bootstrap.utils.githubExternalConnectionUtils.createIntegration(
        setup.token,
        {
          repositoryId: 789,
          installationEntityId: installation.id,
          projectId: project.id,
        },
      );

      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/external-connections/github/integrations/${integration.id}`)
        .set('authorization', `Bearer ${setup.token}`);

      expect(response.status).toEqual(200);

      const integrationsResponse = await request(bootstrap.app.getHttpServer())
        .get(`/projects/${project.id}/external-connections/github/integrations`)
        .set('authorization', `Bearer ${setup.token}`);

      expect(integrationsResponse.body).toEqual([]);
    });

    it('returns 403 when user is not a project member', async () => {
      const setupA = await bootstrap.utils.userUtils.createDefault();
      const setupB = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setupA.token);
      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setupA.token,
        123456,
      );

      githubExternalConnectionClientMock.getRepositoryInfoByInstallationIdAndRepositoryId.mockResolvedValue(
        {
          id: 789,
          owner: 'test-owner',
          name: 'test-repo',
        },
      );

      githubExternalConnectionClientMock.getRepositoryPublicKey.mockResolvedValue({
        key: 'test-public-key',
        keyId: 'test-key-id',
      });

      const integration = await bootstrap.utils.githubExternalConnectionUtils.createIntegration(
        setupA.token,
        {
          repositoryId: 789,
          installationEntityId: installation.id,
          projectId: project.id,
        },
      );

      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/external-connections/github/integrations/${integration.id}`)
        .set('authorization', `Bearer ${setupB.token}`);

      expect(response.status).toEqual(403);
    });

    it('returns 403 when user is not a project owner or admin', async () => {
      const setupA = await bootstrap.utils.userUtils.createDefault();
      const setupB = await bootstrap.utils.userUtils.createDefault();
      const project = await bootstrap.utils.projectUtils.createProject(setupA.token);
      const installation = await bootstrap.utils.githubExternalConnectionUtils.createInstallation(
        setupA.token,
        123456,
      );
      await bootstrap.utils.projectUtils.addMemberToProject(
        project.id,
        setupB.user.id,
        Role.Member,
      );

      githubExternalConnectionClientMock.getRepositoryInfoByInstallationIdAndRepositoryId.mockResolvedValue(
        {
          id: 789,
          owner: 'test-owner',
          name: 'test-repo',
        },
      );

      githubExternalConnectionClientMock.getRepositoryPublicKey.mockResolvedValue({
        key: 'test-public-key',
        keyId: 'test-key-id',
      });

      const integration = await bootstrap.utils.githubExternalConnectionUtils.createIntegration(
        setupA.token,
        {
          repositoryId: 789,
          installationEntityId: installation.id,
          projectId: project.id,
        },
      );

      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/external-connections/github/integrations/${integration.id}`)
        .set('authorization', `Bearer ${setupB.token}`);

      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual('You are not the owner or admin of this project');
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(bootstrap.app.getHttpServer()).delete(
        '/external-connections/github/integrations/60f7eabc1234567890abcdef',
      );

      expect(response.status).toEqual(401);
    });
  });
});
