import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserField } from '../../../common/enum';
import {
  AccountLockedException,
  AccountNotActiveException,
  UserNotVerifiedException,
} from '../../../common/exceptions';
import { ErrorHandlerHelper } from '../../../common/helper';
import { UserResponseHelper } from '../../../common/helper/user-response.helper';
import responseMessage from '../../../common/messages/response.message';
import { UserService } from '../../../modules/user/providers/user.service';
import { HashingProvider } from '../../hashing/providers/hashing.provider';
import { SignInDto } from '../dto/sign-in.dto';
import { AccountLockoutProvider } from './account-lockout.provider';
import { AuthTokensProvider } from './auth-tokens.provider';

@Injectable()
export class SignInProvider {
  private readonly logger = new Logger(SignInProvider.name);

  constructor(
    private readonly authTokensProvider: AuthTokensProvider,
    private readonly hashingProvider: HashingProvider,
    private readonly userService: UserService,
    private readonly accountLockoutProvider: AccountLockoutProvider,
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      if (!signInDto[UserField.EMAIL]) {
        throw new BadRequestException(responseMessage.token.required);
      }
      const user = await this.userService.getUserByEmail(
        signInDto[UserField.EMAIL],
      );

      if (!user) {
        throw new UnauthorizedException(
          responseMessage.auth.invalidCredentials,
        );
      }

      if (this.accountLockoutProvider.isAccountLocked(user)) {
        const remainingMinutes =
          this.accountLockoutProvider.getRemainingLockoutMinutes(user);
        throw new AccountLockedException(remainingMinutes);
      }

      const isPasswordValid = await this.hashingProvider.compare(
        signInDto[UserField.PASSWORD],
        user?.[UserField.PASSWORD] ?? '',
      );

      const userId =
        user._id instanceof Types.ObjectId
          ? user._id.toString()
          : String(user._id);

      if (!isPasswordValid) {
        await this.accountLockoutProvider.incrementFailedAttempts(userId);

        throw new UnauthorizedException(
          responseMessage.auth.invalidCredentials,
        );
      }

      if (!user[UserField.IS_ACTIVE]) {
        throw new AccountNotActiveException();
      }

      if (!user[UserField.IS_USER_VERIFIED]) {
        throw new UserNotVerifiedException();
      }

      await this.accountLockoutProvider.resetFailedAttempts(userId);

      return await UserResponseHelper.generateUserResponseWithTokens(
        user,
        this.authTokensProvider,
      );
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.auth.signInError,
      );
    }
  }
}
