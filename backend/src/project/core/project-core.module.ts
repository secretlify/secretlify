import { Module } from '@nestjs/common';
import { ProjectSecretsVersionReadModule } from '../../project-secrets-version/read/project-secrets-version-read.module';
import { UserReadModule } from '../../user/read/user-read.module';
import { ProjectEventModule } from '../events/project-event.module';
import { ProjectReadModule } from '../read/project-read.module';
import { ProjectWriteModule } from '../write/project-write.module';
import { ProjectCoreController } from './project-core.controller';

@Module({
  imports: [
    ProjectWriteModule,
    ProjectReadModule,
    UserReadModule,
    ProjectSecretsVersionReadModule,
    ProjectEventModule,
  ],
  controllers: [ProjectCoreController],
})
export class ProjectCoreModule {}
