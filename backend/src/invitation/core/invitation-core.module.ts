import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserWriteModule } from '../../user/write/user-write.module';
import { InvitationReadModule } from '../read/invitation-read.module';
import { InvitationWriteModule } from '../write/invitation-write.module';
import { InvitationEntity, InvitationSchema } from './entities/invitation.entity';
import { InvitationCoreController } from './invitation-core.controller';
import { InvitationTtlService } from './invitation-ttl.service';

@Module({
  imports: [
    InvitationReadModule,
    InvitationWriteModule,
    MongooseModule.forFeature([{ name: InvitationEntity.name, schema: InvitationSchema }]),
    UserWriteModule,
  ],
  providers: [InvitationTtlService],
  controllers: [InvitationCoreController],
})
export class InvitationCoreModule {}
