import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthField, CommonField, UserField } from '../../../common/enum';
import { ErrorHandlerHelper } from '../../../common/helper';
import responseMessage from '../../../common/messages/response.message';
import { UserService } from '../../../modules/user/providers/user.service';
import { TokenTypeEnum } from '../../token/enum/token-type.enum';
import { TokenService } from '../../token/providers/token.service';
import { RefreshTokenDto } from '../dto';
import { AuthTokensProvider } from './auth-tokens.provider';

@Injectable()
export class RefreshTokenProvider {
  private readonly logger = new Logger(RefreshTokenProvider.name);

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authTokensProvider: AuthTokensProvider,
  ) {}

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto;

      const foundToken = await this.tokenService.findByToken(refreshToken);
      if (!foundToken) {
        throw new NotFoundException(responseMessage.token.notFound);
      }

      if (foundToken.type !== TokenTypeEnum.REFRESH) {
        throw new BadRequestException(responseMessage.token.invalidType);
      }

      if (new Date() > foundToken.expiresAt) {
        await this.tokenService.removeByToken(foundToken.token);
        throw new BadRequestException(responseMessage.token.expired);
      }

      const user = await this.userService.getUserById(foundToken.userId);
      if (!user) {
        throw new NotFoundException(responseMessage.user.notFound);
      }

      const userId =
        user._id instanceof Types.ObjectId
          ? user._id.toString()
          : String(user._id);

      const tokens = await this.authTokensProvider.authTokens({
        [CommonField.ID]: userId,
        [UserField.EMAIL]: user[UserField.EMAIL],
        [UserField.ROLE]: user[UserField.ROLE],
      });
      return {
        data: {
          [AuthField.ACCESS_TOKEN]: tokens.accessToken.token,
          [AuthField.REFRESH_TOKEN]: tokens.refreshToken.token,
          [AuthField.ACCESS_TOKEN_EXPIRES_IN]: tokens.accessToken.expiry,
          [AuthField.REFRESH_TOKEN_EXPIRES_IN]: tokens.refreshToken.expiry,
        },
        message: responseMessage.auth.refreshToken,
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
