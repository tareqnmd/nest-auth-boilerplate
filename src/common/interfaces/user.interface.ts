import { UserRole } from 'src/modules/user/enum/user-role.enum';
import { REQUEST_USER_KEY } from '../constants';

export interface ITokenUser {
  id: number;
  email: string;
  exp: number;
  iat: number;
}

export interface ITokenPayload {
  id: number;
  email: string;
}

export interface IUserToken {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: Date;
  refreshTokenExpiresIn: Date;
}

export interface IUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  image: string;
  token: IUserToken;
}

export interface RequestWithUser extends Request {
  [REQUEST_USER_KEY]: ITokenUser;
}
