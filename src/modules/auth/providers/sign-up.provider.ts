import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
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
  generateWelcomeOtpPlainText,
  generateWelcomeOtpTemplate,
} from '../../communication/templates/welcome-otp.template';
import { HashingProvider } from '../../hashing/providers/hashing.provider';
import { UserService } from '../../user/providers/user.service';
import { SignUpDto } from '../dto/sign-up.dto';

@Injectable()
export class SignUpProvider {
  private readonly logger = new Logger(SignUpProvider.name);

  constructor(
    private readonly hashingProvider: HashingProvider,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: SendMailProvider,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      if (!signUpDto[UserField.EMAIL]) {
        throw new BadRequestException(responseMessage.auth.emailRequired);
      }

      const userByEmail = await this.userService.getUserByEmail(
        signUpDto[UserField.EMAIL],
      );
      if (userByEmail) {
        throw new ConflictException(responseMessage.user.emailExists);
      }

      const hashedPassword = await this.hashingProvider.hash(
        signUpDto[UserField.PASSWORD],
      );

      const user = await this.userService.createUser({
        ...signUpDto,
        [UserField.PASSWORD]: hashedPassword,
      });

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
        type: TokenTypeEnum.USER_ACTIVATION,
        userId: userId,
        expiresAt: new Date(
          Date.now() + this.jwtConfiguration.userTokenTTL * 1000,
        ),
      });

      const expiryMinutes = Math.floor(this.jwtConfiguration.userTokenTTL / 60);
      const userName = user[UserField.FIRST_NAME]
        ? `${user[UserField.FIRST_NAME]} ${user[UserField.LAST_NAME] || ''}`.trim()
        : undefined;
      const clientUrl =
        this.configService.get<string>('appConfig.clientUrl') || '';

      await this.mailService.sendMail({
        [SendMailDtoField.TO]: user[UserField.EMAIL] as string,
        [SendMailDtoField.SUBJECT]: `Welcome to ${APP_NAME} - Verify Your Account`,
        [SendMailDtoField.TEXT]: generateWelcomeOtpPlainText({
          userName,
          expiryMinutes,
          token: userToken,
          userId,
          clientUrl,
        }),
        [SendMailDtoField.HTML]: generateWelcomeOtpTemplate({
          userName,
          expiryMinutes,
          token: userToken,
          userId,
          clientUrl,
        }),
      });

      return {
        data: {
          [CommonField.ID]: userId,
        },
        message: responseMessage.user.signedUp,
      };
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.auth.signUpError,
      );
    }
  }
}
