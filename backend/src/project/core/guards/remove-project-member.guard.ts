import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectReadService } from '../../read/project-read.service';
import { Role } from '../../../shared/types/role.enum';

@Injectable()
export class RemoveProjectMemberGuard implements CanActivate {
  constructor(readonly projectReadService: ProjectReadService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const { projectId, memberId } = request.params;

    if (!userId) {
      return false;
    }

    const project = await this.projectReadService.findById(projectId);
    const userRole = project.members.get(userId);

    if (userId === memberId) {
      return true;
    }

    if (userRole === Role.Owner) {
      return true;
    }

    if (userRole === Role.Admin) {
      const roleToDelete = project.members.get(memberId);
      if (roleToDelete !== Role.Member) {
        throw new ForbiddenException('Admins can only remove members');
      }
      return true;
    }

    throw new ForbiddenException("You don't have permission to perform this action.");
  }
}
