export interface ITokenUser {
  id: number;
  email: string;
  exp: number;
  iat: number;
}

export interface ITokenNPayload {
  id: number;
  email: string;
}
