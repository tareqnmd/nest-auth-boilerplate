import { Module } from '@nestjs/common';
import { AuthService } from '../auth/providers/auth.service';
import { GetUserByEmailProvider } from './providers/get-user-by-email.provider';
import { GetUserByIdProvider } from './providers/get-user-by-id.provider';
import { UserService } from './providers/user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [
    AuthService,
    UserService,
    GetUserByEmailProvider,
    GetUserByIdProvider,
  ],
})
export class UserModule {}
