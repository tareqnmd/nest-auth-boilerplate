import { Module } from '@nestjs/common';
import { AuthService } from '../auth/providers/auth.service';
import { UserService } from './providers/user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [AuthService, UserService],
})
export class UserModule {}
