import { Types } from 'mongoose';
import { AuthTokensProvider } from '../../modules/auth/providers/auth-tokens.provider';
import { UserDocument } from '../../modules/user/user.schema';
import { AuthField, CommonField, UserField } from '../enum';
import responseMessage from '../messages/response.message';

export class UserResponseHelper {
  static async generateUserResponseWithTokens(
    user: UserDocument,
    authTokensProvider: AuthTokensProvider,
    customMessage?: string,
  ) {
    const userId =
      user._id instanceof Types.ObjectId
        ? user._id.toString()
        : String(user._id);

    const tokens = await authTokensProvider.authTokens({
      [CommonField.ID]: userId,
      [UserField.EMAIL]: user[UserField.EMAIL],
      [UserField.ROLE]: user[UserField.ROLE],
    });

    return {
      data: {
        [CommonField.ID]: userId,
        [UserField.FIRST_NAME]: user[UserField.FIRST_NAME],
        [UserField.LAST_NAME]: user[UserField.LAST_NAME],
        [UserField.EMAIL]: user[UserField.EMAIL],
        [UserField.ROLE]: user[UserField.ROLE],
        [UserField.IMAGE]: user[UserField.IMAGE],
        [UserField.IS_USER_VERIFIED]: user[UserField.IS_USER_VERIFIED],
        [UserField.IS_ACTIVE]: user[UserField.IS_ACTIVE],
        token: {
          [AuthField.ACCESS_TOKEN]: tokens.accessToken.token,
          [AuthField.REFRESH_TOKEN]: tokens.refreshToken.token,
          [AuthField.ACCESS_TOKEN_EXPIRES_IN]: tokens.accessToken.expiry,
          [AuthField.REFRESH_TOKEN_EXPIRES_IN]: tokens.refreshToken.expiry,
        },
      },
      message: customMessage || responseMessage.user.signedIn,
    };
  }

  static generateUserResponse(user: UserDocument, customMessage?: string) {
    const userId =
      user._id instanceof Types.ObjectId
        ? user._id.toString()
        : String(user._id);

    return {
      data: {
        [CommonField.ID]: userId,
        [UserField.FIRST_NAME]: user[UserField.FIRST_NAME],
        [UserField.LAST_NAME]: user[UserField.LAST_NAME],
        [UserField.EMAIL]: user[UserField.EMAIL],
        [UserField.ROLE]: user[UserField.ROLE],
        [UserField.IMAGE]: user[UserField.IMAGE],
        [UserField.IS_USER_VERIFIED]: user[UserField.IS_USER_VERIFIED],
        [UserField.IS_ACTIVE]: user[UserField.IS_ACTIVE],
      },
      message: customMessage || responseMessage.user.signedIn,
    };
  }
}
