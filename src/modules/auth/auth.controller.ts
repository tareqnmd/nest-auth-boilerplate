import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRoute } from '../../common/enum';
import { ControllerTextEnum } from '../../common/enum/controller-text.enum';
import { UserRoleEnum } from '../user/enum';
import { AuthTypeEnum } from './auth.enum';
import { Auth, Roles } from './decorators';
import {
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  SocialDto,
  UnlockAccountDto,
  VerifyUserDto,
} from './dto';
import { RolesGuard } from './guards';
import { AuthService } from './providers/auth.service';

@ApiTags('Auth')
@Controller({ path: AuthRoute.ROOT, version: '1' })
@Auth(AuthTypeEnum.NONE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AuthRoute.SIGN_IN)
  @ApiOperation({ summary: ControllerTextEnum.AUTH_SIGNIN_SUMMARY })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post(AuthRoute.SIGN_UP)
  @ApiOperation({ summary: ControllerTextEnum.AUTH_SIGNUP_SUMMARY })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post(AuthRoute.SOCIAL)
  @ApiOperation({ summary: ControllerTextEnum.AUTH_SOCIAL_SUMMARY })
  social(@Body() socialDto: SocialDto) {
    return this.authService.social(socialDto);
  }

  @Post(AuthRoute.FORGOT_PASSWORD)
  @ApiOperation({ summary: ControllerTextEnum.AUTH_FORGOT_PASSWORD_SUMMARY })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post(AuthRoute.RESET_PASSWORD)
  @ApiOperation({ summary: ControllerTextEnum.AUTH_RESET_PASSWORD_SUMMARY })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post(AuthRoute.REFRESH_TOKEN)
  @ApiOperation({ summary: ControllerTextEnum.AUTH_REFRESH_TOKEN_SUMMARY })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post(AuthRoute.VERIFY_USER)
  @ApiOperation({ summary: ControllerTextEnum.AUTH_VERIFY_USER_SUMMARY })
  verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verifyUser(verifyUserDto);
  }

  @Post(AuthRoute.UNLOCK_ACCOUNT)
  @Auth(AuthTypeEnum.BEARER)
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ControllerTextEnum.AUTH_UNLOCK_ACCOUNT_SUMMARY })
  unlockAccount(@Body() unlockAccountDto: UnlockAccountDto) {
    return this.authService.unlockAccount(unlockAccountDto);
  }
}
