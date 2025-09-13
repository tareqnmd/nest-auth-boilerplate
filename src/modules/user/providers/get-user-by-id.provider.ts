import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';

@Injectable()
export class GetUserByIdProvider {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return user;
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }
}
