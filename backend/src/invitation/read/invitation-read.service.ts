import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvitationEntity } from '../core/entities/invitation.entity';
import { InvitationNormalized } from '../core/entities/invitation.interface';
import { InvitationSerializer } from '../core/entities/invitation.serializer';

@Injectable()
export class InvitationReadService {
  constructor(
    @InjectModel(InvitationEntity.name) private invitationModel: Model<InvitationEntity>,
  ) {}

  public async readByIdOrThrow(id: string): Promise<InvitationNormalized> {
    const invitation = await this.invitationModel.findById(id).lean<InvitationEntity>().exec();

    if (!invitation) {
      throw new NotFoundException(`Invitation not found`);
    }

    return InvitationSerializer.normalize(invitation);
  }
}
