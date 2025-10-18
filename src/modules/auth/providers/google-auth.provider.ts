import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GOOGLE_API_URL } from 'src/common/constants/other-links.constant';
import { UserField } from '../../../common/enum';
import responseMessage from '../../../common/messages/response.message';
import { IGoogleUser } from '../interfaces/google-user.interface';
import { ISocialResponse } from '../interfaces/social-response.interface';

@Injectable()
export class GoogleAuthProvider {
  constructor() {}

  async authenticate(token: string) {
    try {
      const response = await fetch(`${GOOGLE_API_URL}${token}`);
      if (response.status !== 200) {
        throw new UnauthorizedException(
          responseMessage.auth.invalidGoogleToken,
        );
      }
      return (await response.json()) as IGoogleUser;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(responseMessage.auth.invalidGoogleToken);
    }
  }

  async googleAuth(token: string) {
    try {
      const data = await this.authenticate(token);
      if (!data) {
        throw new UnauthorizedException(
          responseMessage.auth.failedToRetrieveGoogleData,
        );
      }
      if (!data.email) {
        throw new UnauthorizedException(
          responseMessage.auth.emailNotProvidedByGoogle,
        );
      }
      return {
        [UserField.FIRST_NAME]: data.givenName || '',
        [UserField.LAST_NAME]: data.familyName || '',
        [UserField.EMAIL]: data.email,
        [UserField.IMAGE]: data.picture,
        [UserField.GOOGLE_ID]: data.sub,
      } as ISocialResponse;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(responseMessage.auth.googleAuthFailed);
    }
  }
}
