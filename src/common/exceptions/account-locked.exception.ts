import { UnauthorizedException } from '@nestjs/common';

export class AccountLockedException extends UnauthorizedException {
  constructor(remainingMinutes: number) {
    super(
      `Your account has been locked due to too many failed login attempts. Please try again after ${remainingMinutes} minutes`,
    );
  }
}
