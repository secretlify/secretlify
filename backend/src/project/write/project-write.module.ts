import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSecretsVersionWriteModule } from 'src/project-secrets-version/write/project-secrets-version-write.module';
import { ProjectEntity, ProjectSchema } from '../core/entities/project.entity';
import { ProjectWriteService } from './project-write.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProjectEntity.name, schema: ProjectSchema }]),
    ProjectSecretsVersionWriteModule,
  ],
  providers: [ProjectWriteService],
  exports: [ProjectWriteService],
})
export class ProjectWriteModule {}
