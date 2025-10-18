import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { TokenTypeEnum } from 'src/modules/token/enum';
import { TokenService } from 'src/modules/token/providers/token.service';
import { APP_NAME } from '../../../common/constants';
import { CommonField, SendMailDtoField, UserField } from '../../../common/enum';
import { ErrorHandlerHelper } from '../../../common/helper';
import responseMessage from '../../../common/messages/response.message';
import jwtConfig from '../../../config/jwt.config';
import { SendMailProvider } from '../../communication/providers/send-mail.provider';
import {
  generateResetPasswordOtpPlainText,
  generateResetPasswordOtpTemplate,
} from '../../communication/templates/reset-password-otp.template';
import { UserService } from '../../user/providers/user.service';
import { ForgotPasswordDto } from '../dto';

@Injectable()
export class ForgotPasswordProvider {
  private readonly logger = new Logger(ForgotPasswordProvider.name);
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: SendMailProvider,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const { email } = forgotPasswordDto;
      if (!email) {
        throw new BadRequestException(responseMessage.auth.emailRequired);
      }

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new NotFoundException(responseMessage.user.notFound);
      }

      const userId =
        user._id instanceof Types.ObjectId
          ? user._id.toString()
          : String(user._id);

      const userToken = await this.jwtService.signAsync(
        {
          [CommonField.ID]: userId,
        },
        {
          expiresIn: this.jwtConfiguration.userTokenTTL,
          secret: this.jwtConfiguration.secret,
        },
      );

      await this.tokenService.create({
        token: userToken,
        type: TokenTypeEnum.RESET_PASSWORD,
        userId: userId,
        expiresAt: new Date(
          Date.now() + this.jwtConfiguration.userTokenTTL * 1000,
        ),
      });

      const userName = user[UserField.FIRST_NAME]
        ? `${user[UserField.FIRST_NAME]} ${user[UserField.LAST_NAME] || ''}`.trim()
        : undefined;
      const clientUrl =
        this.configService.get<string>('appConfig.clientUrl') || '';

      await this.mailService.sendMail({
        [SendMailDtoField.TO]: email,
        [SendMailDtoField.SUBJECT]: `Reset Your ${APP_NAME} Password`,
        [SendMailDtoField.TEXT]: generateResetPasswordOtpPlainText({
          userName: userName,
          token: userToken,
          expiryMinutes: Math.floor(this.jwtConfiguration.userTokenTTL / 60),
          userId,
          clientUrl,
        }),
        [SendMailDtoField.HTML]: generateResetPasswordOtpTemplate({
          userName: userName,
          token: userToken,
          expiryMinutes: Math.floor(this.jwtConfiguration.userTokenTTL / 60),
          userId,
          clientUrl,
        }),
      });

      return {
        data: {
          [CommonField.ID]: userId,
        },
        message: responseMessage.auth.forgotPassword,
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
