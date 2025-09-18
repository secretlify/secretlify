import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectEntity } from '../core/entities/project.entity';
import { ProjectNormalized } from '../core/entities/project.interface';
import { ProjectSerializer } from '../core/entities/project.serializer';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PROJECT_HISTORY_SIZE } from './project-write.constants';

@Injectable()
export class ProjectWriteService {
  constructor(
    @InjectModel(ProjectEntity.name) private projectModel: Model<ProjectEntity>,
    @Inject(PROJECT_HISTORY_SIZE) private readonly maxSecretsVersions: number,
  ) {}

  public async create(dto: CreateProjectDto): Promise<ProjectNormalized> {
    const project = await this.projectModel.create({
      name: dto.name,
      owner: new Types.ObjectId(dto.owner),
      members: [new Types.ObjectId(dto.owner)],
      encryptedSecretsKeys: dto.encryptedKeyVersions,
      encryptedSecretsHistory: [dto.encryptedSecrets],
    });

    return ProjectSerializer.normalize(project);
  }

  public async update(id: string, dto: UpdateProjectDto): Promise<ProjectNormalized> {
    const toSet: { name?: string; encryptedSecretsKeys?: Record<string, string> } = {};
    if (dto.name !== undefined) {
      toSet.name = dto.name;
    }
    if (dto.encryptedKeyVersions !== undefined) {
      toSet.encryptedSecretsKeys = dto.encryptedKeyVersions;
    }

    const updateQuery: any = {};
    if (Object.keys(toSet).length > 0) {
      updateQuery.$set = toSet;
    }

    if (dto.encryptedSecrets) {
      updateQuery.$push = {
        encryptedSecretsHistory: {
          $each: [dto.encryptedSecrets],
          $position: 0,
          $slice: this.maxSecretsVersions,
        },
      };
    }

    if (Object.keys(updateQuery).length === 0) {
      const project = await this.projectModel.findById(new Types.ObjectId(id));
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      return ProjectSerializer.normalize(project);
    }

    const project = await this.projectModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateQuery,
      {
        new: true,
      },
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return ProjectSerializer.normalize(project);
  }

  public async addMember(
    projectId: string,
    memberId: string,
    serverPassphrase: string,
  ): Promise<void> {
    await this.projectModel.updateOne(
      { _id: new Types.ObjectId(projectId) },
      {
        $push: { members: new Types.ObjectId(memberId) },
        $set: { encryptedSecretsKeys: { [memberId]: serverPassphrase } },
      },
    );
  }

  public async delete(id: string): Promise<void> {
    await this.projectModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}
