import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectWriteService } from 'src/project/write/project-write.service';
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
  ) {}

  @Post('invitations')
  @ApiResponse({ type: InvitationSerialized })
  @UseGuards(ProjectOwnerInvitationGuard)
  public async create(
    @CurrentUserId() userId: string,
    @Body() body: CreateInvitationBody,
  ): Promise<InvitationSerialized> {
    const invitation = await this.invitationWriteService.create({ ...body, authorId: userId });
    return InvitationSerializer.serialize(invitation);
  }

  @Get('invitations/me')
  @ApiResponse({ type: [InvitationSerialized] })
  public async findUserInvitations(
    @CurrentUserId() userId: string,
  ): Promise<InvitationSerialized[]> {
    const invitations = await this.invitationReadService.findByAuthorId(userId);
    return invitations.map(InvitationSerializer.serialize);
  }

  @Get('invitations/:id')
  @ApiResponse({ type: InvitationSerialized })
  public async findById(@Param('id') id: string): Promise<InvitationSerialized> {
    const invitation = await this.invitationReadService.findById(id);
    return InvitationSerializer.serialize(invitation);
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
      invitation.projectId,
      userId,
      body.newServerPassphrase,
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
