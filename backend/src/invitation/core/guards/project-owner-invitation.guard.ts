import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/shared/types/role.enum';
import { ProjectReadService } from '../../../project/read/project-read.service';
import { InvitationReadService } from '../../read/invitation-read.service';

@Injectable()
export class ProjectOwnerInvitationGuard implements CanActivate {
  public constructor(
    private readonly invitationReadService: InvitationReadService,
    private readonly projectReadService: ProjectReadService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    let projectId: string;

    if (request.body?.projectId) {
      projectId = request.body.projectId;
    } else if (request.params.id) {
      const invitationId = request.params.id;
      const invitation = await this.invitationReadService.findById(invitationId);
      projectId = invitation.projectId;
    } else {
      throw new UnauthorizedException();
    }

    const project = await this.projectReadService.findById(projectId);
    const userRole = project.members.get(userId);

    if (!userRole) {
      throw new ForbiddenException();
    }

    if (userRole === Role.Owner) {
      return true;
    }

    if (userRole === Role.Admin) {
      if (request.body.role === Role.Admin) {
        throw new ForbiddenException('Admins can only invite members');
      }
      return true;
    }

    throw new ForbiddenException();
  }
}
