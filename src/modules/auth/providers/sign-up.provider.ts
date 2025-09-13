import { ConflictException, Injectable } from '@nestjs/common';
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
    if (isUserExists) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await this.hashingProvider.hash(signUpDto.password);
    const user = await this.userService.createUser({
      ...signUpDto,
      password: hashedPassword,
    });
    console.log(user);
    return user;
  }
}
