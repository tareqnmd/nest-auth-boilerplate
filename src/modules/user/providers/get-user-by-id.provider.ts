import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserByIdProvider {
  constructor() {}

  getUserById(id: string) {
    return `User ${id}`;
  }
}
