import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TokenField } from '../../common/enum';
import { TokenTypeEnum } from './enum/token-type.enum';

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true, unique: true })
  [TokenField.TOKEN]: string;

  @Prop({ required: true })
  [TokenField.TYPE]: TokenTypeEnum;

  @Prop({ required: true })
  [TokenField.USER_ID]: string;

  @Prop({ required: true })
  [TokenField.EXPIRES_AT]: Date;
}

export type TokenDocument = Token & Document;
export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ [TokenField.USER_ID]: 1 });
TokenSchema.index({ [TokenField.TYPE]: 1 });
TokenSchema.index({ [TokenField.EXPIRES_AT]: 1 }, { expireAfterSeconds: 0 });
