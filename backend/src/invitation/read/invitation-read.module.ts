import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationEntity, InvitationSchema } from '../core/entities/invitation.entity';
import { InvitationReadService } from './invitation-read.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: InvitationEntity.name, schema: InvitationSchema }])],
  providers: [InvitationReadService],
  exports: [InvitationReadService],
})
export class InvitationReadModule {}
