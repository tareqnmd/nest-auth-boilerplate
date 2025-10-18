import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ACCOUNT_LOCKOUT_DURATION_MS,
  MAX_FAILED_LOGIN_ATTEMPTS,
} from '../../../common/constants';
import { UserField } from '../../../common/enum';
import { ErrorHandlerHelper } from '../../../common/helper';
import responseMessage from '../../../common/messages/response.message';
import { User, UserDocument } from '../../user/user.schema';

@Injectable()
export class AccountLockoutProvider {
  private readonly logger = new Logger(AccountLockoutProvider.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  isAccountLocked(user: UserDocument): boolean {
    if (!user[UserField.ACCOUNT_LOCKED_UNTIL]) {
      return false;
    }

    const now = new Date();
    const lockedUntil = new Date(user[UserField.ACCOUNT_LOCKED_UNTIL]);

    if (now >= lockedUntil) {
      return false;
    }

    return true;
  }

  getRemainingLockoutMinutes(user: UserDocument): number {
    if (!user[UserField.ACCOUNT_LOCKED_UNTIL]) {
      return 0;
    }

    const now = new Date();
    const lockedUntil = new Date(user[UserField.ACCOUNT_LOCKED_UNTIL]);

    if (now >= lockedUntil) {
      return 0;
    }

    const remainingMs = lockedUntil.getTime() - now.getTime();
    return Math.ceil(remainingMs / 60000);
  }

  async incrementFailedAttempts(userId: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        return null;
      }

      const failedAttempts = (user[UserField.FAILED_LOGIN_ATTEMPTS] || 0) + 1;
      const now = new Date();

      if (failedAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
        const lockUntil = new Date(now.getTime() + ACCOUNT_LOCKOUT_DURATION_MS);

        return await this.userModel.findByIdAndUpdate(
          userId,
          {
            $set: {
              [UserField.FAILED_LOGIN_ATTEMPTS]: failedAttempts,
              [UserField.ACCOUNT_LOCKED_UNTIL]: lockUntil,
              [UserField.LAST_FAILED_LOGIN_AT]: now,
            },
          },
          { new: true },
        );
      } else {
        return await this.userModel.findByIdAndUpdate(
          userId,
          {
            $set: {
              [UserField.FAILED_LOGIN_ATTEMPTS]: failedAttempts,
              [UserField.LAST_FAILED_LOGIN_AT]: now,
            },
          },
          { new: true },
        );
      }
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.updateUserError,
      );
    }
  }

  async resetFailedAttempts(userId: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            [UserField.FAILED_LOGIN_ATTEMPTS]: 0,
            [UserField.ACCOUNT_LOCKED_UNTIL]: null,
            [UserField.LAST_FAILED_LOGIN_AT]: null,
          },
        },
        { new: true },
      );
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.updateUserError,
      );
    }
  }

  async unlockAccount(userId: string): Promise<UserDocument | null> {
    return await this.resetFailedAttempts(userId);
  }
}
