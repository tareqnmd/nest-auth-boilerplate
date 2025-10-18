import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GITHUB_API_URL } from 'src/common/constants';
import { UserField } from '../../../common/enum';
import responseMessage from '../../../common/messages/response.message';
import { IGithubUser } from '../interfaces/github-user.interface';

@Injectable()
export class GithubAuthProvider {
  constructor() {}

  async verifyGithubToken(token: string): Promise<IGithubUser> {
    if (!token)
      throw new UnauthorizedException(responseMessage.auth.githubTokenRequired);
    try {
      const response = await fetch(GITHUB_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (response.status !== 200) {
        throw new UnauthorizedException(
          responseMessage.auth.invalidGithubToken,
        );
      }
      const data = (await response.json()) as IGithubUser;
      if (!data) {
        throw new UnauthorizedException(
          responseMessage.auth.failedToRetrieveGoogleData,
        );
      }
      return data;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(responseMessage.auth.githubApiFailed);
    }
  }

  async githubAuth(token: string) {
    try {
      const data = await this.verifyGithubToken(token);
      if (!data.email) {
        throw new UnauthorizedException(
          responseMessage.auth.emailNotProvidedByGithub,
        );
      }

      const nameParts = data.name ? data.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      return {
        [UserField.FIRST_NAME]: firstName,
        [UserField.LAST_NAME]: lastName,
        [UserField.EMAIL]: data.email,
        [UserField.IMAGE]: data.picture,
        [UserField.GITHUB_ID]: data.id.toString(),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(responseMessage.auth.githubAuthFailed);
    }
  }
}
