import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ collection: 'githubintegrations', timestamps: true })
export class GithubIntegrationEntity {
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProjectEntity', required: true })
  public projectId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'GithubInstallationEntity', required: true })
  public installationEntityId: Types.ObjectId;

  @Prop({ required: true })
  public githubRepositoryId: number;

  @Prop({ required: true })
  public githubRepositoryPublicKey: string;

  @Prop({ required: true })
  public githubRepositoryPublicKeyId: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export type GithubIntegrationDocument = HydratedDocument<GithubIntegrationEntity>;

export const GithubIntegrationSchema = SchemaFactory.createForClass(GithubIntegrationEntity);
