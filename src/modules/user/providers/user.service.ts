import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { CreateUserProvider } from './create-user.provider';
import { GetUserByEmailProvider } from './get-user-by-email.provider';
import { GetUserByIdProvider } from './get-user-by-id.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly getUserByIdProvider: GetUserByIdProvider,
    private readonly getUserByEmailProvider: GetUserByEmailProvider,
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  async getUserById(id: number) {
    return await this.getUserByIdProvider.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return await this.getUserByEmailProvider.getUserByEmail(email);
  }

  async createUser(signUpDto: SignUpDto) {
    return await this.createUserProvider.createUser(signUpDto);
  }
}
