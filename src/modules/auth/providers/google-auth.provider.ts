import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAuthProvider {
  constructor() {}

  googleAuth(token: string) {
    return { token };
  }

  authenticate(token: string) {
    return { token };
  }
}
