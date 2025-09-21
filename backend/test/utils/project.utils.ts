import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as request from 'supertest';
import { CreateProjectBody } from '../../src/project/core/dto/create-project.body';
import { ProjectEntity } from '../../src/project/core/entities/project.entity';
import { ProjectSerialized } from '../../src/project/core/entities/project.interface';

export class ProjectUtils {
  private readonly projectModel: Model<ProjectEntity>;

  constructor(private readonly app: INestApplication) {
    this.projectModel = this.app.get<Model<ProjectEntity>>(getModelToken(ProjectEntity.name));
  }

  public async createProject(
    token: string,
    body: CreateProjectBody = {
      name: 'test-project',
      encryptedKeyVersions: {},
      encryptedSecrets: '',
    },
  ): Promise<ProjectSerialized> {
    const response = await request(this.app.getHttpServer())
      .post('/projects')
      .set('authorization', `Bearer ${token}`)
      .send(body);

    return response.body;
  }

  public async addMemberToProject(projectId: string, memberId: string): Promise<void> {
    await this.projectModel.updateOne(
      { _id: new Types.ObjectId(projectId) },
      { $set: { [`members.${memberId}`]: 'member' } },
    );
  }

  public async getProject(projectId: string, token: string): Promise<ProjectSerialized> {
    const response = await request(this.app.getHttpServer())
      .get(`/projects/${projectId}`)
      .set('authorization', `Bearer ${token}`);

    return response.body;
  }
}
