import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class GithubExternalConnectionUtils {
  constructor(private app: INestApplication) {}

  public async createInstallation(
    token: string,
    githubInstallationId: number = 123456,
  ): Promise<any> {
    const response = await request(this.app.getHttpServer())
      .post('/users/me/external-connections/github/installations')
      .set('authorization', `Bearer ${token}`)
      .send({
        githubInstallationId,
      });
    return response.body;
  }

  public async getInstallation(token: string, installationEntityId: string): Promise<any> {
    const response = await request(this.app.getHttpServer())
      .get(`/external-connections/github/installations/${installationEntityId}`)
      .set('authorization', `Bearer ${token}`);
    return response.body;
  }

  public async getCurrentUserInstallations(token: string): Promise<any> {
    const response = await request(this.app.getHttpServer())
      .get('/users/me/external-connections/github/installations')
      .set('authorization', `Bearer ${token}`);
    return response.body;
  }

  public async getRepositoriesAvailableForInstallation(
    token: string,
    installationEntityId: string,
  ): Promise<any> {
    const response = await request(this.app.getHttpServer())
      .get(`/external-connections/github/installations/${installationEntityId}/repositories`)
      .set('authorization', `Bearer ${token}`);
    return response.body;
  }

  public async createIntegration(
    token: string,
    data: {
      repositoryId: number;
      installationEntityId: string;
      projectId: string;
    },
  ): Promise<any> {
    const response = await request(this.app.getHttpServer())
      .post('/external-connections/github/integrations')
      .set('authorization', `Bearer ${token}`)
      .send(data);
    return response.body;
  }

  public async getProjectIntegrations(token: string, projectId: string): Promise<any> {
    const response = await request(this.app.getHttpServer())
      .get(`/projects/${projectId}/external-connections/github/integrations`)
      .set('authorization', `Bearer ${token}`);
    return response.body;
  }

  public async deleteIntegration(token: string, integrationId: string): Promise<void> {
    await request(this.app.getHttpServer())
      .delete(`/external-connections/github/integrations/${integrationId}`)
      .set('authorization', `Bearer ${token}`);
  }

  public async getInstallationAccessToken(
    token: string,
    installationEntityId: string,
  ): Promise<any> {
    const response = await request(this.app.getHttpServer())
      .get(`/external-connections/github/installations/${installationEntityId}/access-token`)
      .set('authorization', `Bearer ${token}`);
    return response.body;
  }
}
