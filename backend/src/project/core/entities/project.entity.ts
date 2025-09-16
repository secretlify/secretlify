import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ collection: 'projects', timestamps: true })
export class ProjectEntity {
  _id: Types.ObjectId;

  @Prop()
  public name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserEntity' })
  public owner: Types.ObjectId;

  @Prop()
  public encryptedPassphrase: string;

  @Prop()
  public encryptedSecrets: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export type ProjectDocument = HydratedDocument<ProjectEntity>;

export const ProjectSchema = SchemaFactory.createForClass(ProjectEntity);
