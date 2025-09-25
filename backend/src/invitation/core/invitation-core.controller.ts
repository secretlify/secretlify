import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectMemberGuard } from 'src/project/core/guards/project-member.guard';
import { RequireRole } from 'src/project/decorators/require-project-role.decorator';
import { Role } from 'src/shared/types/role.enum';
import { ProjectWriteService } from '../../project/write/project-write.service';
import { UserReadService } from '../../user/read/user-read.service';
import { CurrentUserId } from '../../auth/core/decorators/current-user-id.decorator';
import { InvitationReadService } from '../read/invitation-read.service';
import { InvitationWriteService } from '../write/invitation-write.service';
import { AcceptInvitationBody } from './dto/accept-invitation.body';
import { CreateInvitationBody } from './dto/create-invitation.body';
import { InvitationSerialized } from './entities/invitation.interface';
import { InvitationSerializer } from './entities/invitation.serializer';
import { ProjectOwnerInvitationGuard } from './guards/project-owner-invitation.guard';

@Controller('')
@ApiTags('Invitations')
@ApiBearerAuth()
export class InvitationCoreController {
  constructor(
    private readonly invitationWriteService: InvitationWriteService,
    private readonly invitationReadService: InvitationReadService,
    private readonly projectWriteService: ProjectWriteService,
    private readonly userReadService: UserReadService,
  ) {}

  @Get('projects/:projectId/invitations')
  @UseGuards(ProjectMemberGuard)
  @RequireRole(Role.Owner)
  @ApiResponse({ type: [InvitationSerialized] })
  public async findProjectInvitations(
    @Param('projectId') projectId: string,
  ): Promise<InvitationSerialized[]> {
    const invitations = await this.invitationReadService.findByProjectId(projectId);
    const authors = await this.userReadService.readByIds(invitations.map((i) => i.authorId));

    return invitations
      .map((invitation) => {
        const author = authors.find((a) => a.id === invitation.authorId);
        if (!author) {
          return null;
        }

        return InvitationSerializer.serialize(invitation, author);
      })
      .filter((i) => i !== null);
  }

  @Post('invitations')
  @ApiResponse({ type: InvitationSerialized })
  @UseGuards(ProjectOwnerInvitationGuard)
  public async create(
    @CurrentUserId() userId: string,
    @Body() body: CreateInvitationBody,
  ): Promise<InvitationSerialized> {
    const invitation = await this.invitationWriteService.create({
      ...body,
      authorId: userId,
    });
    const author = await this.userReadService.readByIdOrThrow(userId);

    return InvitationSerializer.serialize(invitation, author);
  }

  @Get('invitations/:id')
  @ApiResponse({ type: InvitationSerialized })
  public async findById(@Param('id') id: string): Promise<InvitationSerialized> {
    const invitation = await this.invitationReadService.findById(id);
    const author = await this.userReadService.readByIdOrThrow(invitation.authorId);

    return InvitationSerializer.serialize(invitation, author);
  }

  @Post('invitations/:id/accept')
  @ApiResponse({ type: InvitationSerialized })
  public async accept(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() body: AcceptInvitationBody,
  ): Promise<void> {
    const invitation = await this.invitationReadService.findById(id);

    await this.projectWriteService.addMember(
      invitation.projectId.toString(),
      userId,
      body.newSecretsKey,
      invitation.role,
    );

    await this.invitationWriteService.delete(id);
  }

  @Delete('invitations/:id')
  @HttpCode(204)
  @UseGuards(ProjectOwnerInvitationGuard)
  public async revoke(@Param('id') id: string): Promise<void> {
    await this.invitationWriteService.delete(id);
  }
}
