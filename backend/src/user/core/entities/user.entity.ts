import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AuthMethod } from '../enum/auth-method.enum';

@Schema({ collection: 'users', timestamps: true })
export class UserEntity {
  _id: Types.ObjectId;

  @Prop()
  email: string;

  @Prop()
  authMethod?: AuthMethod;

  @Prop()
  avatarUrl?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserEntity>;

export const UserSchema = SchemaFactory.createForClass(UserEntity);
