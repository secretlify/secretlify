import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ collection: 'githubinstallations', timestamps: true })
export class GithubInstallationEntity {
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserEntity', required: true })
  public userId: Types.ObjectId;

  @Prop()
  public githubInstallationId: number;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export type GithubInstallationDocument = HydratedDocument<GithubInstallationEntity>;

export const GithubInstallationSchema = SchemaFactory.createForClass(GithubInstallationEntity);
