import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';

@Injectable()
export class GetUserByEmailProvider {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      console.log(user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
