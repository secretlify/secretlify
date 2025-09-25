import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GithubInstallationNormalized } from '../core/entities/github-installation.interface';
import { GithubInstallationSerializer } from '../core/entities/github-installation.serializer';
import { GithubInstallationEntity } from '../core/entities/github-installation.entity';

@Injectable()
export class GithubInstallationReadService {
  constructor(
    @InjectModel(GithubInstallationEntity.name)
    private model: Model<GithubInstallationEntity>,
  ) {}

  public async findById(id: string): Promise<GithubInstallationNormalized> {
    const installation = await this.model.findById(id).lean<GithubInstallationEntity>().exec();

    if (!installation) {
      throw new NotFoundException(`Installation not found`);
    }

    return GithubInstallationSerializer.normalize(installation);
  }

  public async findByGithubInstallationId(
    githubInstallationId: number,
  ): Promise<GithubInstallationNormalized | null> {
    const installation = await this.model
      .findOne({ githubInstallationId })
      .lean<GithubInstallationEntity>()
      .exec();

    return installation ? GithubInstallationSerializer.normalize(installation) : null;
  }

  public async findByUserId(userId: string): Promise<GithubInstallationNormalized[]> {
    const installations = await this.model
      .find({
        userId,
      })
      .lean<GithubInstallationEntity[]>()
      .exec();

    return installations.map(GithubInstallationSerializer.normalize);
  }
}
