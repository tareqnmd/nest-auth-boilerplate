import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/modules/user/enum/user-role.enum';
import { SignUpDto } from '../dto/sign-up.dto';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignUpProvider {
  constructor(private readonly hashingProvider: HashingProvider) {}

  async signUp(signUpDto: SignUpDto) {
    return {
      ...signUpDto,
      password: await this.hashingProvider.hash(signUpDto.password),
      role: UserRole.USER,
    };
  }
}
