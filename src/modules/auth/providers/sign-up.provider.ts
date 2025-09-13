import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/modules/user/enum/user-role.enum';
import { UserService } from 'src/modules/user/providers/user.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignUpProvider {
  constructor(
    private readonly hashingProvider: HashingProvider,
    private readonly userService: UserService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const isUserExists = await this.userService.getUserByEmail(signUpDto.email);
    console.log(isUserExists);
    const user = {
      ...signUpDto,
      password: await this.hashingProvider.hash(signUpDto.password),
      role: UserRole.USER,
    };
    return user;
  }
}
