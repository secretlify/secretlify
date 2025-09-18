import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationEntity, InvitationSchema } from '../core/entities/invitation.entity';
import { InvitationTtlService } from './invitation-ttl.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: InvitationEntity.name, schema: InvitationSchema }])],
  providers: [InvitationTtlService],
  exports: [InvitationTtlService],
})
export class InvitationTtlModule {}
