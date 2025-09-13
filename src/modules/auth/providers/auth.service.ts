import { Injectable } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { SocialDto } from '../dto/social.dto';

@Injectable()
export class AuthService {
  signIn(signInDto: SignInDto) {
    return signInDto;
  }

  signUp(signUpDto: SignUpDto) {
    return signUpDto;
  }

  social(socialDto: SocialDto) {
    return socialDto;
  }
}
