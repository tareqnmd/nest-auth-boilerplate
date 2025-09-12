import { Module } from '@nestjs/common';

import { GetUserByEmailProvider } from './providers/get-user-by-email.provider';
import { GetUserByIdProvider } from './providers/get-user-by-id.provider';
import { UserService } from './providers/user.service';
import { UserController } from './users.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, GetUserByEmailProvider, GetUserByIdProvider],
})
export class UsersModule {}
