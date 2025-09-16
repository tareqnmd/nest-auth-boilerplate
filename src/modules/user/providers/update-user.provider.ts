import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user-social.dto';
import { UpdateUserSocialDto } from '../dto/update-user.dto';
import { UserEntity } from '../user.entity';

@Injectable()
export class UpdateUserProvider {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto | UpdateUserSocialDto,
  ) {
    return await this.userRepository.update(id, updateUserDto);
  }
}
