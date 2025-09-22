import { Module } from '@nestjs/common';
import { UserReadModule } from 'src/user/read/user-read.module';
import { ProjectReadModule } from '../read/project-read.module';
import { ProjectWriteModule } from '../write/project-write.module';
import { ProjectCoreController } from './project-core.controller';

@Module({
  imports: [ProjectReadModule, ProjectWriteModule, UserReadModule],
  controllers: [ProjectCoreController],
})
export class ProjectCoreModule {}
