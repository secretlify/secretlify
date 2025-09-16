import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'invitations', timestamps: true })
export class InvitationEntity {
  _id: Types.ObjectId;

  @Prop()
  public projectId: Types.ObjectId;

  @Prop()
  public authorId: Types.ObjectId;

  @Prop()
  public temporaryPublicKey: string;

  @Prop()
  public temporaryPrivateKey: string;

  @Prop()
  public temporaryServerPassphrase: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export type InvitationDocument = HydratedDocument<InvitationEntity>;

export const InvitationSchema = SchemaFactory.createForClass(InvitationEntity);
