import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(signUpDto: SignUpDto) {
    try {
      const newUser = await this.userRepository.save(signUpDto);
      return newUser;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
