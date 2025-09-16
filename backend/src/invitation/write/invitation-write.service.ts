import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InvitationEntity } from '../core/entities/invitation.entity';
import { InvitationNormalized } from '../core/entities/invitation.interface';
import { InvitationSerializer } from '../core/entities/invitation.serializer';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Injectable()
export class InvitationWriteService {
  constructor(
    @InjectModel(InvitationEntity.name) private invitationModel: Model<InvitationEntity>,
  ) {}

  public async create(dto: CreateInvitationDto): Promise<InvitationNormalized> {
    const invitation = await this.invitationModel.create({
      ...dto,
      projectId: new Types.ObjectId(dto.projectId),
      authorId: new Types.ObjectId(dto.authorId),
    });
    return InvitationSerializer.normalize(invitation);
  }

  public async delete(id: string): Promise<void> {
    await this.invitationModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}
