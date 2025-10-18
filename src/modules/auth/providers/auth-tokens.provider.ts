import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANTS } from '../../../common/constants';
import { CommonField, UserField } from '../../../common/enum';
import { ErrorHandlerHelper } from '../../../common/helper';
import { ITokenUser } from '../../../common/interfaces';
import responseMessage from '../../../common/messages/response.message';
import jwtConfig from '../../../config/jwt.config';
import { TokenTypeEnum } from '../../token/enum/token-type.enum';
import { TokenService } from '../../token/providers/token.service';

@Injectable()
export class AuthTokensProvider {
  private readonly logger = new Logger(AuthTokensProvider.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  public async generateToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T,
  ) {
    const token = await this.jwtService.signAsync(
      {
        [CommonField.ID]: userId,
        ...payload,
      },
      {
        expiresIn: expiresIn,
        secret: this.jwtConfiguration.secret,
      },
    );
    const expiry = new Date(
      Date.now() + expiresIn * JWT_CONSTANTS.SECONDS_TO_MILLISECONDS,
    );
    return { token, expiry };
  }

  public async authTokens(user: ITokenUser) {
    try {
      if (!user[CommonField.ID]) {
        throw new BadRequestException(responseMessage.auth.userIdRequired);
      } else if (!user[UserField.EMAIL]) {
        throw new BadRequestException(responseMessage.auth.emailRequired);
      } else if (!user[UserField.ROLE]) {
        throw new BadRequestException(responseMessage.auth.roleRequired);
      }
      const tokenPayload: Partial<ITokenUser> = {};
      if (user[UserField.EMAIL]) tokenPayload.email = user[UserField.EMAIL];
      if (user[UserField.ROLE]) tokenPayload.role = user[UserField.ROLE];

      const [accessToken, refreshToken] = await Promise.all([
        this.generateToken(
          user[CommonField.ID],
          this.jwtConfiguration.accessTokenTTL,
          tokenPayload,
        ),
        this.generateToken(
          user[CommonField.ID],
          this.jwtConfiguration.refreshTokenTTL,
        ),
      ]);

      await this.tokenService.create({
        token: refreshToken.token,
        type: TokenTypeEnum.REFRESH,
        userId: user[CommonField.ID],
        expiresAt: new Date(
          Date.now() +
            this.jwtConfiguration.refreshTokenTTL *
              JWT_CONSTANTS.SECONDS_TO_MILLISECONDS,
        ),
      });

      return { accessToken, refreshToken };
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.error,
      );
    }
  }
}
