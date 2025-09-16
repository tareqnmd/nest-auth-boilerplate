import { Injectable } from '@nestjs/common';
import { SignUpDtoWithSocial } from 'src/modules/auth/dto/sign-up-social.dto';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { UpdateUserDto } from '../dto/update-user-social.dto';
import { UpdateUserSocialDto } from '../dto/update-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { GetUserByEmailProvider } from './get-user-by-email.provider';
import { GetUserByIdProvider } from './get-user-by-id.provider';
import { UpdateUserProvider } from './update-user.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly getUserByIdProvider: GetUserByIdProvider,
    private readonly getUserByEmailProvider: GetUserByEmailProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly updateUserProvider: UpdateUserProvider,
  ) {}

  async getUserById(id: number) {
    return await this.getUserByIdProvider.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return await this.getUserByEmailProvider.getUserByEmail(email);
  }

  async createUser(signUpDto: SignUpDto | SignUpDtoWithSocial) {
    return await this.createUserProvider.createUser(signUpDto);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserSocialDto | UpdateUserDto,
  ) {
    return await this.updateUserProvider.updateUser(id, updateUserDto);
  }
}
