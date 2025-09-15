import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { GITHUB_API_URL } from 'src/common/constants';
import socialConfig from 'src/config/social.config';

@Injectable()
export class GithubAuthProvider {
  constructor(
    @Inject(socialConfig.KEY)
    private readonly socialConfiguration: ConfigType<typeof socialConfig>,
  ) {}

  async verifyGithubToken(token: string) {
    if (!token) throw new UnauthorizedException();
    try {
      const response = await fetch(GITHUB_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (response.status !== 200) throw new UnauthorizedException();
      const data = await response.json();
      return data;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async githubAuth(token: string) {
    try {
      const data = await this.verifyGithubToken(token);
      console.log(data);
      if (!data) throw new UnauthorizedException();
      const [firstName, lastName] = data.name.split(' ');
      return {
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        email: data.email,
        image: data.avatar_url,
        githubId: data.id,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
