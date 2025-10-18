import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CommonField, ConfigurationField } from '../../common/enum';

export type ConfigurationDocument = Configuration &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Configuration {
  @Prop({ required: true, unique: true })
  [ConfigurationField.KEY]: string;

  @Prop({ required: true })
  [ConfigurationField.VALUE]: string;

  @Prop({ required: true })
  [CommonField.CREATED_BY]: string;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);

ConfigurationSchema.index({ [CommonField.CREATED_BY]: 1 });
