import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserByEmailProvider {
  constructor() {}

  getUserByEmail(email: string) {
    return `User ${email}`;
  }
}
