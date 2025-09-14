import { Module } from '@nestjs/common';
import { ProjectReadModule } from '../read/project-read.module';
import { ProjectWriteModule } from '../write/project-write.module';
import { ProjectCoreController } from './project-core.controller';

@Module({
  imports: [ProjectReadModule, ProjectWriteModule],
  controllers: [ProjectCoreController],
})
export class ProjectCoreModule {}
