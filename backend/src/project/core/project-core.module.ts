import { Module } from '@nestjs/common';
import { ProjectSecretsVersionReadModule } from 'src/project-secrets-version/read/project-secrets-version-read.module';
import { UserReadModule } from 'src/user/read/user-read.module';
import { ProjectReadModule } from '../read/project-read.module';
import { ProjectWriteModule } from '../write/project-write.module';
import { ProjectCoreController } from './project-core.controller';

@Module({
  imports: [ProjectReadModule, ProjectWriteModule, UserReadModule, ProjectSecretsVersionReadModule],
  controllers: [ProjectCoreController],
})
export class ProjectCoreModule {}
