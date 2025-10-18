import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TokenService } from 'src/modules/token/providers/token.service';
import { CommonField, TokenField, UserField } from '../../../common/enum';
import { ErrorHandlerHelper } from '../../../common/helper';
import responseMessage from '../../../common/messages/response.message';
import { HashingProvider } from '../../hashing/providers/hashing.provider';
import { UserService } from '../../user/providers/user.service';
import { ResetPasswordDto } from '../dto';

@Injectable()
export class ResetPasswordProvider {
  private readonly logger = new Logger(ResetPasswordProvider.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly hashingProvider: HashingProvider,
    private readonly userService: UserService,
  ) {}

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { token, newPassword } = resetPasswordDto;

      if (!token || !resetPasswordDto.userId || !newPassword) {
        throw new BadRequestException(responseMessage.resetPassword.required);
      }
      const foundToken = await this.tokenService.findByToken(token);
      if (!foundToken) {
        throw new NotFoundException(responseMessage.resetPassword.notFound);
      }
      if (
        foundToken[TokenField.USER_ID] !== resetPasswordDto[CommonField.USER_ID]
      ) {
        throw new BadRequestException(responseMessage.resetPassword.invalid);
      }
      if (new Date() > foundToken[TokenField.EXPIRES_AT]) {
        await this.tokenService.removeByToken(foundToken[TokenField.TOKEN]);
        throw new BadRequestException(responseMessage.resetPassword.expired);
      }
      const user = await this.userService.getUserById(
        foundToken[TokenField.USER_ID],
      );

      const userId =
        user._id instanceof Types.ObjectId
          ? user._id.toString()
          : String(user._id);

      const hashedPassword = await this.hashingProvider.hash(newPassword);

      user[UserField.PASSWORD] = hashedPassword;
      await this.userService.updateUser(userId, user);

      await this.tokenService.removeByToken(foundToken[TokenField.TOKEN]);

      return {
        data: true,
        message: responseMessage.auth.resetPassword,
      };
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.error,
      );
    }
  }
}
