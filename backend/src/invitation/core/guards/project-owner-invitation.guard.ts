import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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

    if (project.members.get(userId) !== Role.Owner) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
