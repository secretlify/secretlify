import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ collection: 'projectsecretsversions', timestamps: true })
export class ProjectSecretsVersionEntity {
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProjectEntity', required: true })
  public projectId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserEntity' })
  public authorId: Types.ObjectId;

  @Prop({ default: '' })
  public encryptedSecrets: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export type ProjectSecretsVersionDocument = HydratedDocument<ProjectSecretsVersionEntity>;

export const ProjectSecretsVersionSchema = SchemaFactory.createForClass(
  ProjectSecretsVersionEntity,
);
