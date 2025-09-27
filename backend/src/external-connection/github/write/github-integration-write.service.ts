import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GithubIntegrationEntity } from '../core/entities/github-integration.entity';
import { GithubIntegrationNormalized } from '../core/entities/github-integration.interface';
import { GithubIntegrationSerializer } from '../core/entities/github-integration.serializer';
import { CreateGithubIntegrationDto } from './dto/create-github-integration.dto';

@Injectable()
export class GithubIntegrationWriteService {
  constructor(
    @InjectModel(GithubIntegrationEntity.name)
    private githubIntegrationModel: Model<GithubIntegrationEntity>,
  ) {}

  public async create(dto: CreateGithubIntegrationDto): Promise<GithubIntegrationNormalized> {
    const integration = await this.githubIntegrationModel.create({
      projectId: dto.cryptlyProjectId,
      githubRepositoryId: dto.githubRepositoryId,
      githubRepositoryPublicKey: dto.repositoryPublicKey,
      githubRepositoryPublicKeyId: dto.repositoryPublicKeyId,
    });

    return GithubIntegrationSerializer.normalize(integration);
  }

  public async deleteById(integrationId: string): Promise<void> {
    await this.githubIntegrationModel.deleteOne({ _id: new Types.ObjectId(integrationId) });
  }

  // todo: very important
  public async deleteByProjectId(cryptlyProjectId: string): Promise<void> {
    await this.githubIntegrationModel.deleteMany({ projectId: cryptlyProjectId });
  }
}
