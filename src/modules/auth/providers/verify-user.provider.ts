import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TokenService } from 'src/modules/token/providers/token.service';
import { CommonField, TokenField, UserField } from '../../../common/enum';
import responseMessage from '../../../common/messages/response.message';
import { UserService } from '../../user/providers/user.service';
import { VerifyUserDto } from '../dto';

@Injectable()
export class VerifyUserProvider {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async verifyUser(verifyUserDto: VerifyUserDto) {
    const { token } = verifyUserDto;
    if (!token) {
      throw new BadRequestException(responseMessage.token.required);
    }
    const foundToken = await this.tokenService.findByToken(token);
    if (!foundToken) {
      throw new NotFoundException(responseMessage.token.notFound);
    }
    if (foundToken[TokenField.USER_ID] !== verifyUserDto[CommonField.USER_ID]) {
      throw new BadRequestException(responseMessage.token.invalid);
    }
    if (new Date() > foundToken.expiresAt) {
      await this.tokenService.removeByToken(foundToken[TokenField.TOKEN]);
      throw new BadRequestException(responseMessage.token.expired);
    }
    const user = await this.userService.getUserById(
      foundToken[TokenField.USER_ID],
    );
    if (!user) {
      throw new NotFoundException(responseMessage.user.notFound);
    }

    const userId =
      user._id instanceof Types.ObjectId
        ? user._id.toString()
        : String(user._id);

    user[UserField.IS_USER_VERIFIED] = true;
    await this.userService.updateUser(userId, user);

    await this.tokenService.removeByToken(foundToken[TokenField.TOKEN]);

    return {
      data: true,
      message: responseMessage.auth.verifyUser,
    };
  }
}
