import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectEntity } from '../core/entities/project.entity';
import { ProjectNormalized } from '../core/entities/project.interface';
import { ProjectSerializer } from '../core/entities/project.serializer';

@Injectable()
export class ProjectReadService {
  constructor(@InjectModel(ProjectEntity.name) private projectModel: Model<ProjectEntity>) {}

  public async findById(id: string): Promise<ProjectNormalized> {
    const project = await this.projectModel.findById(id).lean<ProjectEntity>().exec();

    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    return ProjectSerializer.normalize(project);
  }

  public async findByOwnerId(ownerId: string): Promise<ProjectNormalized[]> {
    const projects = await this.projectModel
      .find({ owner: ownerId })
      .lean<ProjectEntity[]>()
      .exec();
    return projects.map(ProjectSerializer.normalize);
  }
}
