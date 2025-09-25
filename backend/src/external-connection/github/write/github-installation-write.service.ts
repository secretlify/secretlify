import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GithubInstallationEntity } from '../core/entities/github-installation.entity';
import { CreateGithubInstallationDto } from './dto/create-github-installation.dto';
import { GithubInstallationNormalized } from '../core/entities/github-installation.interface';
import { GithubInstallationSerializer } from '../core/entities/github-installation.serializer';

@Injectable()
export class GithubInstallationWriteService {
  constructor(
    @InjectModel(GithubInstallationEntity.name)
    private model: Model<GithubInstallationEntity>,
  ) {}

  public async create(dto: CreateGithubInstallationDto): Promise<GithubInstallationNormalized> {
    const installation = await this.model.create({
      githubInstallationId: dto.githubInstallationId,
      userId: dto.userId,
    });

    return GithubInstallationSerializer.normalize(installation);
  }
}
