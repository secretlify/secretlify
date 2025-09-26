import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ collection: 'githubintegrations', timestamps: true })
export class GithubIntegrationEntity {
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProjectEntity', required: true })
  public cryptlyProjectId: Types.ObjectId;

  @Prop({ required: true })
  public githubRepositoryId: number;

  @Prop({ required: true })
  public repositoryPublicKey: string;

  @Prop({ required: true })
  public repositoryPublicKeyId: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export type GithubIntegrationDocument = HydratedDocument<GithubIntegrationEntity>;

export const GithubIntegrationSchema = SchemaFactory.createForClass(GithubIntegrationEntity);
