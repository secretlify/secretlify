import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_ROLE_KEY } from 'src/project/decorators/require-project-role.decorator';
import { Role } from 'src/shared/types/role.enum';
import { requireIsMongoId } from 'src/shared/utils/mongo-id-transform';
import { ProjectReadService } from '../../read/project-read.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    readonly projectReadService: ProjectReadService,
    private reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const projectId = request.params.projectId;

    const allowedRoles =
      this.reflector.getAllAndOverride<Role[]>(REQUIRE_ROLE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? Object.values(Role);

    if (!userId || !projectId) {
      return false;
    }

    requireIsMongoId(projectId);

    const project = await this.projectReadService.findById(projectId);
    const userRole = project.members.get(userId);

    if (!userRole) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    throw new ForbiddenException('You are not allowed to perform this action');
  }
}
