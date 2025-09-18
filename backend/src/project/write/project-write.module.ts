import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectEntity, ProjectSchema } from '../core/entities/project.entity';
import { PROJECT_HISTORY_SIZE } from './project-write.constants';
import { ProjectWriteService } from './project-write.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProjectEntity.name, schema: ProjectSchema }])],
  providers: [ProjectWriteService, { provide: PROJECT_HISTORY_SIZE, useValue: 100 }],
  exports: [ProjectWriteService],
})
export class ProjectWriteModule {}
