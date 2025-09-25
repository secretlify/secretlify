import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Role } from 'src/shared/types/role.enum';

export interface Integrations {
  githubInstallationId: number;
}
@Schema({ collection: 'projects', timestamps: true })
export class ProjectEntity {
  _id: Types.ObjectId;

  @Prop({ required: true })
  public name: string;

  @Prop({
    type: Map,
    of: {
      type: String,
      enum: Object.values(Role),
    },
  })
  public members: Map<string, Role>;

  @Prop({ type: MongooseSchema.Types.Map, of: String, default: {} })
  public encryptedSecretsKeys: Record<string, string>;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;

  @Prop({ default: {}, type: MongooseSchema.Types.Mixed, required: true })
  public integrations: Integrations;
}

export type ProjectDocument = HydratedDocument<ProjectEntity>;

export const ProjectSchema = SchemaFactory.createForClass(ProjectEntity);
