import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectSecretsVersionWriteService } from 'src/project-secrets-version/write/project-secrets-version-write.service';
import { Role } from 'src/shared/types/role.enum';
import { ProjectEntity } from '../core/entities/project.entity';
import { ProjectNormalized } from '../core/entities/project.interface';
import { ProjectSerializer } from '../core/entities/project.serializer';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectWriteService {
  constructor(
    @InjectModel(ProjectEntity.name) private projectModel: Model<ProjectEntity>,
    private readonly projectSecretsVersionWriteService: ProjectSecretsVersionWriteService,
  ) {}

  public async create(dto: CreateProjectDto, userId: string): Promise<ProjectNormalized> {
    const project = await this.projectModel.create({
      name: dto.name,
      members: new Map([[userId, Role.Owner]]),
      encryptedSecretsKeys: dto.encryptedSecretsKeys,
    });

    await this.projectSecretsVersionWriteService.create({
      projectId: project._id,
      authorId: new Types.ObjectId(userId),
      encryptedSecrets: dto.encryptedSecrets,
    });

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
        $set: {
          [`members.${memberId}`]: Role.Member,
          [`encryptedSecretsKeys.${memberId}`]: serverPassphrase,
        },
      },
    );
  }

  public async removeMember(projectId: string, memberId: string): Promise<void> {
    await this.projectModel.updateOne(
      { _id: new Types.ObjectId(projectId) },
      {
        $unset: {
          [`members.${memberId}`]: '',
          [`encryptedSecretsKeys.${memberId}`]: '',
        },
      },
    );
  }

  public async delete(id: string): Promise<void> {
    await this.projectModel.deleteOne({ _id: new Types.ObjectId(id) });
  }

  public async update(
    id: string,
    dto: UpdateProjectDto,
    authorId: string,
  ): Promise<ProjectNormalized> {
    if (dto.encryptedSecrets) {
      await this.projectSecretsVersionWriteService.create({
        projectId: new Types.ObjectId(id),
        authorId: new Types.ObjectId(authorId),
        encryptedSecrets: dto.encryptedSecrets,
      });
    }

    const updateQuery = this.buildUpdateQuery(dto);

    if (Object.keys(updateQuery).length === 0) {
      return this.handleNoUpdate(id);
    }

    const project = await this.executeUpdate(id, updateQuery);
    return ProjectSerializer.normalize(project);
  }

  private buildUpdateQuery(dto: UpdateProjectDto): Record<string, unknown> {
    const setOperation = this.buildSetNameOrKeys(dto);

    return { ...setOperation };
  }

  private buildSetNameOrKeys(dto: UpdateProjectDto): Record<string, any> {
    const toSet: { name?: string; encryptedSecretsKeys?: Record<string, string> } = {};
    if (dto.name !== undefined) {
      toSet.name = dto.name;
    }
    if (dto.encryptedSecretsKeys !== undefined) {
      toSet.encryptedSecretsKeys = dto.encryptedSecretsKeys;
    }
    return Object.keys(toSet).length > 0 ? { $set: toSet } : {};
  }

  private async handleNoUpdate(id: string): Promise<ProjectNormalized> {
    const project = await this.projectModel.findById(new Types.ObjectId(id));
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return ProjectSerializer.normalize(project);
  }

  private async executeUpdate(
    id: string,
    updateQuery: Record<string, unknown>,
  ): Promise<ProjectEntity> {
    const project = await this.projectModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateQuery,
      { new: true },
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
