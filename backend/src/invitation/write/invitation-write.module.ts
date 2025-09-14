import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationEntity, InvitationSchema } from '../core/entities/invitation.entity';
import { InvitationWriteService } from './invitation-write.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: InvitationEntity.name, schema: InvitationSchema }])],
  providers: [InvitationWriteService],
  exports: [InvitationWriteService],
})
export class InvitationWriteModule {}
