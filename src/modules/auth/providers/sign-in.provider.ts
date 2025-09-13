import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user.interface';
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
    try {
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
          id: userExists.id,
          email: userExists.email,
          name: userExists.firstName + ' ' + userExists.lastName,
          role: userExists.role,
          image: userExists.image,
          token: {
            accessToken: tokens.accessToken.token,
            refreshToken: tokens.refreshToken.token,
            accessTokenExpiresIn: tokens.accessToken.expiry,
            refreshTokenExpiresIn: tokens.refreshToken.expiry,
          },
        } as IUser,
        message: responseMessage.user.signedIn,
      };
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
