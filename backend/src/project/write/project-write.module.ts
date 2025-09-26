import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSecretsVersionWriteModule } from '../../project-secrets-version/write/project-secrets-version-write.module';
import { ProjectEntity, ProjectSchema } from '../core/entities/project.entity';
import { ProjectEventModule } from '../events/project-event.module';
import { ProjectWriteService } from './project-write.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProjectEntity.name, schema: ProjectSchema }]),
    ProjectSecretsVersionWriteModule,
    ProjectEventModule,
  ],
  providers: [ProjectWriteService],
  exports: [ProjectWriteService],
})
export class ProjectWriteModule {}
