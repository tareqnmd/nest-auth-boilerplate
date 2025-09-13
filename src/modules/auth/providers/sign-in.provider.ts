import { Injectable } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class SignInProvider {
  constructor() {}

  signIn(signInDto: SignInDto) {
    return signInDto;
  }
}
