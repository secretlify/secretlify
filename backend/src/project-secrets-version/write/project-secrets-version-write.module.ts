import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectSecretsVersionEntity,
  ProjectSecretsVersionSchema,
} from '../core/entities/project-secrets-version.entity';
import { ProjectSecretsVersionWriteService } from './project-secrets-version-write.service';
import { PROJECT_HISTORY_SIZE } from './project-secrets-version.constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectSecretsVersionEntity.name, schema: ProjectSecretsVersionSchema },
    ]),
  ],
  providers: [ProjectSecretsVersionWriteService, { provide: PROJECT_HISTORY_SIZE, useValue: 100 }],
  exports: [ProjectSecretsVersionWriteService],
})
export class ProjectSecretsVersionWriteModule {}
