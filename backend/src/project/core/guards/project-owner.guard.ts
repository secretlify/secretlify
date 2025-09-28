import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../../../shared/types/role.enum';
import { ProjectReadService } from '../../read/project-read.service';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(readonly projectReadService: ProjectReadService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const projectId = request.params.projectId;

    if (!userId || !projectId) {
      return false;
    }

    const project = await this.projectReadService.findById(projectId);

    const userRole = project.members.get(userId);

    if (userRole !== Role.Owner) {
      throw new ForbiddenException('You are not the owner of this project');
    }

    return true;
  }
}
