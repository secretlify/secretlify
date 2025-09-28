import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GithubIntegrationEntity } from '../core/entities/github-integration.entity';
import { GithubIntegrationNormalized } from '../core/entities/github-integration.interface';
import { GithubIntegrationSerializer } from '../core/entities/github-integration.serializer';

@Injectable()
export class GithubIntegrationReadService {
  constructor(
    @InjectModel(GithubIntegrationEntity.name)
    private githubIntegrationModel: Model<GithubIntegrationEntity>,
  ) {}

  public async findById(id: string): Promise<GithubIntegrationNormalized> {
    const integration = await this.githubIntegrationModel
      .findById(id)
      .lean<GithubIntegrationEntity>()
      .exec();

    if (!integration) {
      throw new NotFoundException(`Integration not found`);
    }

    return GithubIntegrationSerializer.normalize(integration);
  }

  public async findByProjectId(projectId: string): Promise<GithubIntegrationNormalized[]> {
    const integrations = await this.githubIntegrationModel
      .find({ projectId })
      .lean<GithubIntegrationEntity[]>()
      .exec();

    return integrations.map((integration) => GithubIntegrationSerializer.normalize(integration));
  }

  public async findByProjectIdAndRepositoryId(dto: {
    projectId: string;
    githubRepositoryId: number;
  }): Promise<GithubIntegrationNormalized | null> {
    const integration = await this.githubIntegrationModel
      .findOne({ projectId: dto.projectId, githubRepositoryId: dto.githubRepositoryId })
      .lean<GithubIntegrationEntity>()
      .exec();

    return integration ? GithubIntegrationSerializer.normalize(integration) : null;
  }
}
