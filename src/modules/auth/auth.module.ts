import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { UsersModule } from '../user/users.module';
import { AuthController } from './auth.controller';
import { AuthTokensProvider } from './providers/auth-tokens.provider';
import { AuthService } from './providers/auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import { SocialProvider } from './providers/social.provider';
import { GoogleAuthProvider } from './providers/google-auth.provider';
import { GithubAuthProvider } from './providers/github-auth.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SignInProvider,
    SignUpProvider,
    SocialProvider,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    AuthTokensProvider,
    GoogleAuthProvider,
    GithubAuthProvider,
  ],
  imports: [
    UsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
