import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthField, UserField } from '../../../common/enum';
import { UserResponseHelper } from '../../../common/helper/user-response.helper';
import responseMessage from '../../../common/messages/response.message';
import { UserService } from '../../../modules/user/providers/user.service';
import { UserDocument } from '../../../modules/user/user.schema';
import { SignUpDtoWithSocial } from '../dto/sign-up-social.dto';
import { SocialDto } from '../dto/social.dto';
import { SocialProviderEnum } from '../enum/social-provider.enum';
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

  async userData(user: UserDocument) {
    if (!user[UserField.IS_ACTIVE]) {
      throw new UnauthorizedException(responseMessage.auth.accountNotActive);
    }

    return await UserResponseHelper.generateUserResponseWithTokens(
      user,
      this.authTokensProvider,
    );
  }

  async social(socialDto: SocialDto) {
    const provider = socialDto[AuthField.SOCIAL_PROVIDER];
    if (!provider) {
      throw new BadRequestException(
        responseMessage.auth.socialLoginTypeRequired,
      );
    }

    if (!socialDto.token) {
      throw new BadRequestException(responseMessage.auth.authTokenRequired);
    }

    let socialResponse: ISocialResponse;
    if (provider === SocialProviderEnum.GOOGLE) {
      socialResponse = await this.googleAuthProvider.googleAuth(
        socialDto[AuthField.TOKEN],
      );
    } else if (provider === SocialProviderEnum.GITHUB) {
      socialResponse = await this.githubAuthProvider.githubAuth(
        socialDto[AuthField.TOKEN],
      );
    } else {
      throw new BadRequestException(responseMessage.auth.unsupportedSocialType);
    }

    if (!socialResponse[UserField.EMAIL]) {
      throw new BadRequestException(
        responseMessage.auth.emailRequiredForSocial,
      );
    }

    const user = await this.userService.getUserByEmail(
      socialResponse[UserField.EMAIL],
    );

    if (user) {
      const userId =
        user._id instanceof Types.ObjectId
          ? user._id.toString()
          : String(user._id);

      if (provider === SocialProviderEnum.GOOGLE) {
        if (!user[UserField.GOOGLE_ID] && socialResponse[UserField.GOOGLE_ID]) {
          const existingUserWithGoogleId =
            await this.userService.getUserByGoogleId(
              socialResponse[UserField.GOOGLE_ID],
            );
          if (existingUserWithGoogleId) {
            const existingUserId =
              existingUserWithGoogleId._id instanceof Types.ObjectId
                ? existingUserWithGoogleId._id.toString()
                : String(existingUserWithGoogleId._id);
            if (existingUserId !== userId) {
              throw new BadRequestException(
                responseMessage.auth.googleIdAlreadyLinked,
              );
            }
          }
          await this.userService.updateUser(userId, {
            [UserField.GOOGLE_ID]: socialResponse[UserField.GOOGLE_ID],
            [UserField.IS_USER_VERIFIED]: true,
          });
        } else if (
          user[UserField.GOOGLE_ID] &&
          user[UserField.GOOGLE_ID] !== socialResponse[UserField.GOOGLE_ID]
        ) {
          throw new BadRequestException(
            responseMessage.auth.googleAccountMismatch,
          );
        }
      }

      if (provider === SocialProviderEnum.GITHUB) {
        if (socialResponse[UserField.GITHUB_ID]) {
          if (!user[UserField.GITHUB_ID]) {
            const existingUserWithGithubId =
              await this.userService.getUserByGithubId(
                socialResponse[UserField.GITHUB_ID],
              );
            if (existingUserWithGithubId) {
              const existingUserId =
                existingUserWithGithubId._id instanceof Types.ObjectId
                  ? existingUserWithGithubId._id.toString()
                  : String(existingUserWithGithubId._id);
              if (existingUserId !== userId) {
                throw new BadRequestException(
                  responseMessage.auth.githubIdAlreadyLinked,
                );
              }
            }
            await this.userService.updateUser(userId, {
              [UserField.GITHUB_ID]: socialResponse[UserField.GITHUB_ID],
              [UserField.IS_USER_VERIFIED]: true,
            });
          } else if (
            user[UserField.GITHUB_ID] &&
            user[UserField.GITHUB_ID] !== socialResponse[UserField.GITHUB_ID]
          ) {
            throw new BadRequestException(
              responseMessage.auth.githubAccountMismatch,
            );
          }
        }
      }

      return await this.userData(user);
    } else {
      if (
        provider === SocialProviderEnum.GOOGLE &&
        socialResponse[UserField.GOOGLE_ID]
      ) {
        const existingUserWithGoogleId =
          await this.userService.getUserByGoogleId(
            socialResponse[UserField.GOOGLE_ID],
          );
        if (existingUserWithGoogleId) {
          throw new BadRequestException(
            responseMessage.auth.googleIdAlreadyLinked,
          );
        }
      }

      if (
        provider === SocialProviderEnum.GITHUB &&
        socialResponse[UserField.GITHUB_ID]
      ) {
        const existingUserWithGithubId =
          await this.userService.getUserByGithubId(
            socialResponse[UserField.GITHUB_ID],
          );
        if (existingUserWithGithubId) {
          throw new BadRequestException(
            responseMessage.auth.githubIdAlreadyLinked,
          );
        }
      }

      const newUser: SignUpDtoWithSocial & {
        [UserField.GOOGLE_ID]?: string;
        [UserField.GITHUB_ID]?: string;
      } = {
        [UserField.FIRST_NAME]: socialResponse[UserField.FIRST_NAME],
        [UserField.LAST_NAME]: socialResponse[UserField.LAST_NAME],
        [UserField.EMAIL]: socialResponse[UserField.EMAIL],
        [UserField.IMAGE]: socialResponse[UserField.IMAGE],
        [UserField.IS_USER_VERIFIED]: true,
      };

      if (
        provider === SocialProviderEnum.GOOGLE &&
        socialResponse[UserField.GOOGLE_ID]
      ) {
        newUser[UserField.GOOGLE_ID] = socialResponse[UserField.GOOGLE_ID];
      } else if (
        provider === SocialProviderEnum.GITHUB &&
        socialResponse[UserField.GITHUB_ID]
      ) {
        newUser[UserField.GITHUB_ID] = socialResponse[UserField.GITHUB_ID];
      }

      const newUserDoc = await this.userService.createUser(newUser);
      return await this.userData(newUserDoc);
    }
  }
}
