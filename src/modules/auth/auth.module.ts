import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunicationModule } from '../communication/communication.module';
import { HashingModule } from '../hashing/hashing.module';
import { TokenModule } from '../token/token.module';
import { User, UserSchema } from '../user/user.schema';
import { UsersModule } from '../user/users.module';
import { AuthController } from './auth.controller';
import { GithubAuthProvider } from './providers';
import { AccountLockoutProvider } from './providers/account-lockout.provider';
import { AuthTokensProvider } from './providers/auth-tokens.provider';
import { AuthService } from './providers/auth.service';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { GoogleAuthProvider } from './providers/google-auth.provider';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import { SocialProvider } from './providers/social.provider';
import { UnlockAccountProvider } from './providers/unlock-account.provider';
import { VerifyUserProvider } from './providers/verify-user.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SignInProvider,
    SignUpProvider,
    SocialProvider,
    AuthTokensProvider,
    GoogleAuthProvider,
    GithubAuthProvider,
    RefreshTokenProvider,
    ResetPasswordProvider,
    VerifyUserProvider,
    ForgotPasswordProvider,
    AccountLockoutProvider,
    UnlockAccountProvider,
  ],
  imports: [
    UsersModule,
    JwtModule,
    HashingModule,
    TokenModule,
    CommunicationModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class AuthModule {}
