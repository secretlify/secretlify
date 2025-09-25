import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GithubIntegrationEntity } from 'src/integration/github/entities/github-integration.entity';
import { GithubIntegrationSerializer } from 'src/integration/github/entities/github-integration.serializer';
import { GithubIntegrationNormalized } from 'src/integration/github/entities/github-integration.interface';

@Injectable()
export class GithubIntegrationReadService {
  constructor(
    @InjectModel(GithubIntegrationEntity.name)
    private githubIntegrationModel: Model<GithubIntegrationEntity>,
  ) {}

  public async findById(integrationId: string): Promise<GithubIntegrationNormalized> {
    const integration = await this.githubIntegrationModel
      .findById(integrationId)
      .lean<GithubIntegrationEntity>()
      .exec();

    if (!integration) {
      throw new NotFoundException(`Integration not found`);
    }

    return GithubIntegrationSerializer.normalize(integration);
  }

  public async findByProjectId(cryptlyProjectId: string): Promise<GithubIntegrationNormalized[]> {
    const integrations = await this.githubIntegrationModel
      .find({ cryptlyProjectId })
      .lean<GithubIntegrationEntity[]>()
      .exec();

    return integrations.map((integration) => GithubIntegrationSerializer.normalize(integration));
  }

  public async findByRepositoryId(repositoryId: number): Promise<GithubIntegrationNormalized> {
    const integration = await this.githubIntegrationModel
      .findOne({ repositoryId })
      .lean<GithubIntegrationEntity>()
      .exec();

    if (!integration) {
      throw new NotFoundException(`Integration not found`);
    }

    return GithubIntegrationSerializer.normalize(integration);
  }
}
