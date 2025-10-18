import { UnauthorizedException } from '@nestjs/common';

export class AccountNotActiveException extends UnauthorizedException {
  constructor() {
    super('Your account is not active. Please contact support');
  }
}
