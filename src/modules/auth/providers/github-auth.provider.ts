import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubAuthProvider {
  constructor() {}

  githubAuth(token: string) {
    return { token };
  }

  authenticate(token: string) {
    return { token };
  }
}
