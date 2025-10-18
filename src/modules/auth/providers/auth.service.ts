import { Injectable } from '@nestjs/common';
import {
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
  UnlockAccountDto,
  VerifyUserDto,
} from '../dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { SocialDto } from '../dto/social.dto';
import { ForgotPasswordProvider } from './forgot-password.provider';
import { RefreshTokenProvider } from './refresh-token.provider';
import { ResetPasswordProvider } from './reset-password.provider';
import { SignInProvider } from './sign-in.provider';
import { SignUpProvider } from './sign-up.provider';
import { SocialProvider } from './social.provider';
import { UnlockAccountProvider } from './unlock-account.provider';
import { VerifyUserProvider } from './verify-user.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,
    private readonly signUpProvider: SignUpProvider,
    private readonly socialProvider: SocialProvider,
    private readonly forgotPasswordProvider: ForgotPasswordProvider,
    private readonly resetPasswordProvider: ResetPasswordProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
    private readonly verifyUserProvider: VerifyUserProvider,
    private readonly unlockAccountProvider: UnlockAccountProvider,
  ) {}

  signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }

  signUp(signUpDto: SignUpDto) {
    return this.signUpProvider.signUp(signUpDto);
  }

  social(socialDto: SocialDto) {
    return this.socialProvider.social(socialDto);
  }

  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordProvider.forgotPassword(forgotPasswordDto);
  }

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordProvider.resetPassword(resetPasswordDto);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }

  verifyUser(verifyUserDto: VerifyUserDto) {
    return this.verifyUserProvider.verifyUser(verifyUserDto);
  }

  unlockAccount(unlockAccountDto: UnlockAccountDto) {
    return this.unlockAccountProvider.unlockAccount(unlockAccountDto);
  }
}
