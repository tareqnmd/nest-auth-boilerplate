import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../dto/sign-up.dto';

@Injectable()
export class SignUpProvider {
  constructor() {}

  signUp(signUpDto: SignUpDto) {
    return signUpDto;
  }
}
