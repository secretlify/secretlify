import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectReadService } from '../../read/project-read.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(readonly projectReadService: ProjectReadService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const projectId = request.params.projectId;

    if (!userId || !projectId) {
      return false;
    }

    const project = await this.projectReadService.findById(projectId);

    if (project.members.has(userId)) {
      return true;
    }

    throw new ForbiddenException('You are not a member of this project');
  }
}
