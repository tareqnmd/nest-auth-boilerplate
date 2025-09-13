import { Injectable } from '@nestjs/common';
import { GetUserByEmailProvider } from './get-user-by-email.provider';
import { GetUserByIdProvider } from './get-user-by-id.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly getUserByIdProvider: GetUserByIdProvider,
    private readonly getUserByEmailProvider: GetUserByEmailProvider,
  ) {}

  getUserById(id: number) {
    return this.getUserByIdProvider.getUserById(id);
  }

  getUserByEmail(email: string) {
    return this.getUserByEmailProvider.getUserByEmail(email);
  }
}
