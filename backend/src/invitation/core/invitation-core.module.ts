import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectWriteModule } from 'src/project/write/project-write.module';
import { UserReadModule } from 'src/user/read/user-read.module';
import { ProjectReadModule } from '../../project/read/project-read.module';
import { UserWriteModule } from '../../user/write/user-write.module';
import { InvitationReadModule } from '../read/invitation-read.module';
import { InvitationTtlModule } from '../ttl/invitation-ttl.module';
import { InvitationWriteModule } from '../write/invitation-write.module';
import { InvitationEntity, InvitationSchema } from './entities/invitation.entity';
import { ProjectOwnerInvitationGuard } from './guards/project-owner-invitation.guard';
import { InvitationCoreController } from './invitation-core.controller';

@Module({
  imports: [
    InvitationReadModule,
    InvitationWriteModule,
    InvitationTtlModule,
    MongooseModule.forFeature([{ name: InvitationEntity.name, schema: InvitationSchema }]),
    UserWriteModule,
    ProjectReadModule,
    ProjectWriteModule,
    UserReadModule,
  ],
  providers: [ProjectOwnerInvitationGuard],
  controllers: [InvitationCoreController],
})
export class InvitationCoreModule {}
