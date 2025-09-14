import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectReadService } from '../../read/project-read.service';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(private readonly projectReadService: ProjectReadService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const projectId = request.params.id;

    if (!userId || !projectId) {
      return false;
    }

    const project = await this.projectReadService.findById(projectId);

    const isOwner = project.owner === userId;

    if (!isOwner) {
      throw new ForbiddenException('You are not the owner of this project');
    }

    return true;
  }
}
