import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommonField } from '../../../common/enum';
import responseMessage from '../../../common/messages/response.message';
import { UserService } from '../../user/providers/user.service';
import { UnlockAccountDto } from '../dto/unlock-account.dto';
import { AccountLockoutProvider } from './account-lockout.provider';

@Injectable()
export class UnlockAccountProvider {
  constructor(
    private readonly userService: UserService,
    private readonly accountLockoutProvider: AccountLockoutProvider,
  ) {}

  async unlockAccount(unlockAccountDto: UnlockAccountDto) {
    try {
      const user = await this.userService.getUserById(unlockAccountDto.userId);

      if (!user) {
        throw new NotFoundException(responseMessage.user.notFound);
      }

      await this.accountLockoutProvider.unlockAccount(unlockAccountDto.userId);

      return {
        data: {
          [CommonField.ID]: unlockAccountDto.userId,
          unlocked: true,
        },
        message: 'Account unlocked successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        responseMessage.global.internalServerError,
      );
    }
  }
}
