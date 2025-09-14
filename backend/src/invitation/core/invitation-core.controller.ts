import { Body, Controller, Delete, HttpCode, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '../../auth/core/decorators/current-user-id.decorator';
import { UserWriteService } from '../../user/write/user-write.service';
import { InvitationReadService } from '../read/invitation-read.service';
import { InvitationWriteService } from '../write/invitation-write.service';
import { AcceptInvitationBody } from './dto/accept-invitation.body';
import { CreateInvitationBody } from './dto/create-invitation.body';
import { InvitationSerialized } from './entities/invitation.interface';
import { InvitationSerializer } from './entities/invitation.serializer';

@Controller('invitations')
@ApiTags('Invitations')
@ApiBearerAuth()
export class InvitationCoreController {
  constructor(
    private readonly invitationWriteService: InvitationWriteService,
    private readonly invitationReadService: InvitationReadService,
    private readonly userWriteService: UserWriteService,
  ) {}

  @Post()
  @ApiResponse({ type: InvitationSerialized })
  public async create(@Body() body: CreateInvitationBody): Promise<InvitationSerialized> {
    const invitation = await this.invitationWriteService.create(body);
    return InvitationSerializer.serialize(invitation);
  }

  @Post(':id')
  @ApiResponse({ type: InvitationSerialized })
  public async get(@Param('id') id: string): Promise<InvitationSerialized> {
    const invitation = await this.invitationReadService.readByIdOrThrow(id);
    return InvitationSerializer.serialize(invitation);
  }

  @Post(':id/accept')
  @ApiResponse({ type: InvitationSerialized })
  public async accept(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() body: AcceptInvitationBody,
  ): Promise<void> {
    const invitation = await this.invitationReadService.readByIdOrThrow(id);

    await this.userWriteService.update({
      id: userId,
      passphraseHash: body.newPassphrase,
    });

    await this.invitationWriteService.delete(id);
  }

  @Delete(':id')
  @HttpCode(204)
  public async revoke(@Param('id') id: string): Promise<void> {
    await this.invitationWriteService.delete(id);
  }
}
