import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserField } from '../../common/enum';
import { UserRoleEnum } from './enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, unique: true, sparse: true })
  [UserField.EMAIL]?: string;

  @Prop({ required: false })
  [UserField.PASSWORD]?: string;

  @Prop({ required: true })
  [UserField.FIRST_NAME]: string;

  @Prop({ required: true })
  [UserField.LAST_NAME]: string;

  @Prop({ default: UserRoleEnum.USER })
  [UserField.ROLE]: UserRoleEnum;

  @Prop({ default: false })
  [UserField.IS_USER_VERIFIED]: boolean;

  @Prop({ default: true })
  [UserField.IS_ACTIVE]: boolean;

  @Prop({ required: false, unique: true, sparse: true })
  [UserField.GOOGLE_ID]?: string;

  @Prop({ required: false, unique: true, sparse: true })
  [UserField.GITHUB_ID]?: string;

  @Prop({ required: false })
  [UserField.IMAGE]?: string;

  @Prop({ default: 0 })
  [UserField.FAILED_LOGIN_ATTEMPTS]: number;

  @Prop({ required: false })
  [UserField.ACCOUNT_LOCKED_UNTIL]?: Date;

  @Prop({ required: false })
  [UserField.LAST_FAILED_LOGIN_AT]?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ [UserField.ROLE]: 1 });
UserSchema.index({ [UserField.IS_ACTIVE]: 1 });
