import { UnauthorizedException } from '@nestjs/common';

export class UserNotVerifiedException extends UnauthorizedException {
  constructor() {
    super(
      'Your account is not verified. Please verify your account to sign in',
    );
  }
}
