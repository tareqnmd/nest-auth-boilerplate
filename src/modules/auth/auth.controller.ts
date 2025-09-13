import { Body, Controller, Post } from '@nestjs/common';
import { AuthTypeEnum } from './auth.enum';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SocialDto } from './dto/social.dto';
import { AuthService } from './providers/auth.service';

@Controller('auth')
@Auth(AuthTypeEnum.NONE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('social')
  social(@Body() socialDto: SocialDto) {
    return this.authService.social(socialDto);
  }
}
