import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user.interface';
import responseMessage from 'src/common/messages/response.message';
import { UserService } from 'src/modules/user/providers/user.service';
import { UserEntity } from 'src/modules/user/user.entity';
import { SignUpDtoWithSocial } from '../dto/sign-up-social.dto';
import { SocialDto } from '../dto/social.dto';
import { SocialType } from '../enum/social-type.enum';
import { ISocialResponse } from '../interfaces/social-response.interface';
import { AuthTokensProvider } from './auth-tokens.provider';
import { GithubAuthProvider } from './github-auth.provider';
import { GoogleAuthProvider } from './google-auth.provider';

@Injectable()
export class SocialProvider {
  constructor(
    private readonly userService: UserService,
    private readonly authTokensProvider: AuthTokensProvider,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly githubAuthProvider: GithubAuthProvider,
  ) {}

  async userData(user: UserEntity) {
    const tokens = await this.authTokensProvider.authTokens({
      id: user.id,
      email: user.email,
    });
    return {
      data: {
        id: user.id,
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
        role: user.role,
        image: user.image,
        token: {
          accessToken: tokens.accessToken.token,
          refreshToken: tokens.refreshToken.token,
          accessTokenExpiresIn: tokens.accessToken.expiry,
          refreshTokenExpiresIn: tokens.refreshToken.expiry,
        },
      } as IUser,
      message: responseMessage.user.signedIn,
    };
  }

  async social(socialDto: SocialDto) {
    const type = socialDto.type;
    if (type) {
      let socialResponse: ISocialResponse;
      if (type === SocialType.GOOGLE) {
        socialResponse = await this.googleAuthProvider.googleAuth(
          socialDto.token,
        );
      } else if (type === SocialType.GITHUB) {
        socialResponse = await this.githubAuthProvider.githubAuth(
          socialDto.token,
        );
      } else {
        throw new BadRequestException('Unsupported social type');
      }
      const user = await this.userService.getUserByEmail(socialResponse.email);
      if (user) {
        if (type === SocialType.GOOGLE) {
          if (!user.googleId) {
            await this.userService.updateUser(user.id, {
              googleId: socialResponse.googleId,
            });
          }
          if (user.googleId !== socialResponse.googleId) {
            throw new BadRequestException('Invalid Google ID');
          }
        }
        if (type === SocialType.GITHUB) {
          if (!user.githubId) {
            await this.userService.updateUser(user.id, {
              githubId: socialResponse.githubId,
            });
          }
          if (user.githubId !== socialResponse.githubId) {
            throw new BadRequestException('Invalid GitHub ID');
          }
        }

        return await this.userData(user);
      } else {
        const newUser: SignUpDtoWithSocial = {
          firstName: socialResponse.firstName,
          lastName: socialResponse.lastName,
          email: socialResponse.email,
          image: socialResponse.image,
          ...(type === SocialType.GOOGLE &&
            socialResponse.googleId && {
              googleId: socialResponse.googleId,
            }),
          ...(type === SocialType.GITHUB &&
            socialResponse.githubId && {
              githubId: socialResponse.githubId,
            }),
        };
        const user = await this.userService.createUser(newUser);
        return await this.userData(user);
      }
    } else {
      throw new BadRequestException('Authentication failed');
    }
  }
}
