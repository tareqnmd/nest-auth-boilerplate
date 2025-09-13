import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetUserByEmailProvider } from './providers/get-user-by-email.provider';
import { GetUserByIdProvider } from './providers/get-user-by-id.provider';
import { UserService } from './providers/user.service';
import { UserEntity } from './user.entity';
import { UserController } from './users.controller';
import { CreateUserProvider } from './providers/create-user.provider';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    GetUserByEmailProvider,
    GetUserByIdProvider,
    CreateUserProvider,
  ],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
