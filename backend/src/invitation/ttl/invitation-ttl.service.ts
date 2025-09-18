import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { InvitationEntity } from '../core/entities/invitation.entity';

@Injectable()
export class InvitationTtlService {
  constructor(
    @InjectModel(InvitationEntity.name) private invitationModel: Model<InvitationEntity>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  public async removeExpiredInvitations(): Promise<void> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await this.invitationModel.deleteMany({
      createdAt: { $lt: twentyFourHoursAgo },
    });
  }
}
