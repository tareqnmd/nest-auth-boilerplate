import { Request } from 'express';
import { UserRoleEnum } from '../../modules/user/enum/user-role.enum';
import { REQUEST_USER_KEY } from '../constants';
import { AuthField, CommonField, UserField } from '../enum';

export interface ITokenUser {
  [CommonField.ID]: string;
  [UserField.EMAIL]?: string;
  [UserField.ROLE]: UserRoleEnum;
}

export interface ITokenInfo {
  [AuthField.ACCESS_TOKEN]: string;
  [AuthField.REFRESH_TOKEN]: string;
  [AuthField.ACCESS_TOKEN_EXPIRES_IN]: Date;
  [AuthField.REFRESH_TOKEN_EXPIRES_IN]: Date;
}

export interface IUserInfo {
  [CommonField.ID]: string;
  [UserField.EMAIL]?: string;
  [UserField.FIRST_NAME]: string;
  [UserField.LAST_NAME]: string;
  [UserField.ROLE]: UserRoleEnum;
  [UserField.IMAGE]?: string;
  [UserField.IS_USER_VERIFIED]: boolean;
  [UserField.IS_ACTIVE]: boolean;
  [UserField.GOOGLE_ID]?: string;
}

export interface IUser extends IUserInfo {
  [AuthField.TOKEN]: ITokenInfo;
}

export interface RequestWithUser extends Request {
  [REQUEST_USER_KEY]: ITokenUser;
}
