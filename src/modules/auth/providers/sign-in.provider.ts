import { Injectable, UnauthorizedException } from '@nestjs/common';
import responseMessage from 'src/common/messages/response.message';
import { UserService } from 'src/modules/user/providers/user.service';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthTokensProvider } from './auth-tokens.provider';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly authTokensProvider: AuthTokensProvider,
    private readonly hashingProvider: HashingProvider,
    private readonly userService: UserService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const userExists = await this.userService.getUserByEmail(signInDto.email);
    if (!userExists) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.hashingProvider.compare(
      signInDto.password,
      userExists?.password ?? '',
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.authTokensProvider.authTokens(userExists);

    return {
      data: {
        ...userExists,
        ...tokens,
      },
      message: responseMessage.user.signedIn,
    };
  }
}
