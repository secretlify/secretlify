import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GithubIntegrationEntity } from 'src/integration/github/entities/github-integration.entity';
import { GithubIntegrationSerializer } from 'src/integration/github/entities/github-integration.serializer';
import { CreateGithubIntegrationDto } from 'src/integration/github/write/dto/create-github-integration.dto';
import { GithubIntegrationNormalized } from 'src/integration/github/entities/github-integration.interface';

@Injectable()
export class GithubIntegrationWriteService {
  constructor(
    @InjectModel(GithubIntegrationEntity.name)
    private githubIntegrationModel: Model<GithubIntegrationEntity>,
  ) {}

  public async create(dto: CreateGithubIntegrationDto): Promise<GithubIntegrationNormalized> {
    const integration = await this.githubIntegrationModel.create({
      cryptlyProjectId: dto.cryptlyProjectId,
      githubRepositoryId: dto.githubRepositoryId,
      repositoryPublicKey: dto.repositoryPublicKey,
      repositoryPublicKeyId: dto.repositoryPublicKeyId,
    });

    return GithubIntegrationSerializer.normalize(integration);
  }

  public async deleteByProjectId(cryptlyProjectId: string): Promise<void> {
    await this.githubIntegrationModel.deleteMany({ cryptlyProjectId });
  }
}
