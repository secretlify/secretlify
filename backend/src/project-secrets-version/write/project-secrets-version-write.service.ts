import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProjectSecretsVersionDocument,
  ProjectSecretsVersionEntity,
} from '../core/entities/project-secrets-version.entity';
import { PROJECT_HISTORY_SIZE } from './project-secrets-version.constants';

@Injectable()
export class ProjectSecretsVersionWriteService {
  constructor(
    @InjectModel(ProjectSecretsVersionEntity.name)
    private readonly projectSecretsVersionModel: Model<ProjectSecretsVersionDocument>,
    @Inject(PROJECT_HISTORY_SIZE) private readonly maxHistorySize: number,
  ) {}

  public async create(dto: {
    projectId: Types.ObjectId;
    authorId: Types.ObjectId;
    encryptedSecrets: string;
  }): Promise<ProjectSecretsVersionDocument> {
    const version = new this.projectSecretsVersionModel(dto);
    await version.save();

    const count = await this.projectSecretsVersionModel.countDocuments({
      projectId: dto.projectId,
    });

    if (count > this.maxHistorySize) {
      const oldestVersions = await this.projectSecretsVersionModel
        .find({ projectId: dto.projectId }, { _id: 1 })
        .sort({ createdAt: 1 })
        .limit(count - this.maxHistorySize)
        .exec();

      await this.projectSecretsVersionModel.deleteMany({
        _id: { $in: oldestVersions.map((v) => v._id) },
      });
    }

    return version;
  }
}
