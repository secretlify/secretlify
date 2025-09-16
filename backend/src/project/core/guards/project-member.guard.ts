import { ExecutionContext, Injectable } from '@nestjs/common';
import { ProjectReadService } from '../../read/project-read.service';
import { ProjectOwnerGuard } from './project-owner.guard';

@Injectable()
export class ProjectMemberGuard extends ProjectOwnerGuard {
  constructor(readonly projectReadService: ProjectReadService) {
    super(projectReadService);
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const projectId = request.params.projectId;

    if (!userId || !projectId) {
      return false;
    }

    const project = await this.projectReadService.findById(projectId);
    // at the point of writing this, owner is still in members but in case this changes, this class extends owner guard
    const isMember = project.members.includes(userId);

    if (isMember) {
      return true;
    }

    return super.canActivate(context);
  }
}
