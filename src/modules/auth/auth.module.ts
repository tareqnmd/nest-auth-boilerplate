import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { SignInProvider } from './providers/sign-in.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import { SocialProvider } from './providers/social.provider';
import { HassingProvider } from './providers/hassing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SignInProvider,
    SignUpProvider,
    SocialProvider,
    HassingProvider,
    BcryptProvider,
    HashingProvider,
  ],
})
export class AuthModule {}
