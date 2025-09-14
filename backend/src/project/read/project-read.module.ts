import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectEntity, ProjectSchema } from '../core/entities/project.entity';
import { ProjectReadService } from './project-read.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProjectEntity.name, schema: ProjectSchema }])],
  providers: [ProjectReadService],
  exports: [ProjectReadService],
})
export class ProjectReadModule {}
