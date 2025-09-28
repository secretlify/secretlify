import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserReadModule } from '../../user/read/user-read.module';
import {
  ProjectSecretsVersionEntity,
  ProjectSecretsVersionSchema,
} from '../core/entities/project-secrets-version.entity';
import { ProjectSecretsVersionReadService } from './project-secrets-version-read.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectSecretsVersionEntity.name, schema: ProjectSecretsVersionSchema },
    ]),
    UserReadModule,
  ],
  providers: [ProjectSecretsVersionReadService],
  exports: [ProjectSecretsVersionReadService],
})
export class ProjectSecretsVersionReadModule {}
