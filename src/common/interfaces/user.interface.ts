import { UserRole } from 'src/modules/user/enum/user-role.enum';

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
