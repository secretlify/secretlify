import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectEntity } from '../core/entities/project.entity';
import { ProjectNormalized } from '../core/entities/project.interface';
import { ProjectSerializer } from '../core/entities/project.serializer';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectWriteService {
  constructor(@InjectModel(ProjectEntity.name) private projectModel: Model<ProjectEntity>) {}

  public async create(dto: CreateProjectDto): Promise<ProjectNormalized> {
    const project = await this.projectModel.create({
      name: dto.name,
      owner: new Types.ObjectId(dto.owner),
      encryptedPassphrase: dto.encryptedPassphrase,
      encryptedSecrets: dto.encryptedSecrets,
    });

    return ProjectSerializer.normalize(project);
  }

  public async update(id: string, dto: UpdateProjectDto): Promise<ProjectNormalized> {
    const project = await this.projectModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, dto, {
      new: true,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return ProjectSerializer.normalize(project);
  }

  public async delete(id: string): Promise<void> {
    await this.projectModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}
