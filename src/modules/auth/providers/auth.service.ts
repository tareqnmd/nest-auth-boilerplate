import { Injectable } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { SocialDto } from '../dto/social.dto';
import { SignInProvider } from './sign-in.provider';
import { SignUpProvider } from './sign-up.provider';
import { SocialProvider } from './social.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,
    private readonly signUpProvider: SignUpProvider,
    private readonly socialProvider: SocialProvider,
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
}
