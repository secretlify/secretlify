import { Module } from '@nestjs/common';
import { ProjectSecretsVersionReadModule } from '../read/project-secrets-version-read.module';
import { ProjectSecretsVersionWriteModule } from '../write/project-secrets-version-write.module';

@Module({
  imports: [ProjectSecretsVersionWriteModule, ProjectSecretsVersionReadModule],
})
export class ProjectSecretsVersionCoreModule {}
