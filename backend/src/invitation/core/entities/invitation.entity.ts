import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Role } from '../../../shared/types/role.enum';

@Schema({ collection: 'invitations', timestamps: true })
export class InvitationEntity {
  _id: Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'ProjectEntity' })
  public projectId: Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'UserEntity' })
  public authorId: Types.ObjectId;

  @Prop({ type: String, enum: Role, default: Role.Member })
  public role: Role;

  @Prop()
  public temporaryPublicKey: string;

  @Prop()
  public temporaryPrivateKey: string;

  @Prop()
  public temporarySecretsKey: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export type InvitationDocument = HydratedDocument<InvitationEntity>;

export const InvitationSchema = SchemaFactory.createForClass(InvitationEntity);
