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
