import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { SignInProvider } from './providers/sign-in.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import { SocialProvider } from './providers/social.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SignInProvider, SignUpProvider, SocialProvider],
})
export class AuthModule {}
