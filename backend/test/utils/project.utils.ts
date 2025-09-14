import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateProjectBody } from '../../src/project/core/dto/create-project.body';
import { ProjectSerialized } from '../../src/project/core/entities/project.interface';

export class ProjectUtils {
  constructor(private readonly app: INestApplication) {}

  public async createProject(
    token: string,
    body: CreateProjectBody = {
      name: 'test-project',
      encryptedPassphrases: {},
      encryptedSecrets: {},
    },
  ): Promise<ProjectSerialized> {
    const response = await request(this.app.getHttpServer())
      .post('/projects')
      .set('authorization', `Bearer ${token}`)
      .send(body);

    return response.body;
  }
}
