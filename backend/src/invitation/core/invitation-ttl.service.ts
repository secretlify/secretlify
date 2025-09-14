import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { InvitationEntity } from './entities/invitation.entity';

@Injectable()
export class InvitationTtlService {
  private readonly logger = new Logger(InvitationTtlService.name);

  constructor(
    @InjectModel(InvitationEntity.name) private invitationModel: Model<InvitationEntity>,
  ) {}

  @Cron('0 * * * *') // Every hour
  public async handleCron(): Promise<void> {
    this.logger.log('Running invitation cleanup cron job');
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const result = await this.invitationModel.deleteMany({
      createdAt: { $lt: oneHourAgo },
    });

    this.logger.log(`Deleted ${result.deletedCount} expired invitations`);
  }
}
