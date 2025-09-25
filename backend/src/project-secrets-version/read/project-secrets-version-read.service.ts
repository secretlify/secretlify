import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserSerializer } from '../../user/core/entities/user.serializer';
import { UserReadService } from '../../user/read/user-read.service';
import {
  ProjectSecretsVersionDocument,
  ProjectSecretsVersionEntity,
} from '../core/entities/project-secrets-version.entity';
import {
  ProjectSecretsVersionNormalized,
  ProjectSecretsVersionSerialized,
} from '../core/entities/project-secrets-version.interface';
import { ProjectSecretsVersionSerializer } from '../core/entities/project-secrets-version.serializer';

@Injectable()
export class ProjectSecretsVersionReadService {
  constructor(
    @InjectModel(ProjectSecretsVersionEntity.name)
    private readonly projectSecretsVersionModel: Model<ProjectSecretsVersionDocument>,
    private readonly userReadService: UserReadService,
  ) {}

  public async findLatestByProjectId(
    projectId: Types.ObjectId,
  ): Promise<ProjectSecretsVersionNormalized> {
    const version = await this.projectSecretsVersionModel
      .findOne({ projectId })
      .sort({ createdAt: -1 })
      .lean<ProjectSecretsVersionEntity>()
      .exec();

    if (!version) {
      throw new NotFoundException(`Secrets version not found for project ${projectId}`);
    }

    return ProjectSecretsVersionSerializer.normalize(version);
  }

  public async findManyLatestByProjectIds(
    projectIds: Types.ObjectId[],
  ): Promise<ProjectSecretsVersionNormalized[]> {
    const versions = await this.projectSecretsVersionModel.aggregate<ProjectSecretsVersionEntity>([
      { $match: { projectId: { $in: projectIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$projectId',
          latestVersion: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$latestVersion' } },
    ]);

    return versions.map(ProjectSecretsVersionSerializer.normalize);
  }

  public async findByProjectId(
    projectId: Types.ObjectId,
  ): Promise<ProjectSecretsVersionSerialized[]> {
    const versions = await this.projectSecretsVersionModel
      .find({ projectId })
      .sort({ createdAt: -1 })
      .exec();

    const authorIds = versions
      .map((v) => v.authorId)
      .filter((id): id is Types.ObjectId => !!id)
      .map((id) => id.toString());

    const authors = await this.userReadService.readByIds(authorIds);
    const authorsPartial = authors.map(UserSerializer.serializePartial);

    return ProjectSecretsVersionSerializer.serializeMany(versions, authorsPartial);
  }
}
