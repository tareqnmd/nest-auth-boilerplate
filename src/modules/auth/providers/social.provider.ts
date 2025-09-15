import { BadRequestException, Injectable } from '@nestjs/common';
import { SocialDto } from '../dto/social.dto';
import { SocialType } from '../enum/social-type.enum';
import { GithubAuthProvider } from './github-auth.provider';
import { GoogleAuthProvider } from './google-auth.provider';

@Injectable()
export class SocialProvider {
  constructor(
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly githubAuthProvider: GithubAuthProvider,
  ) {}

  social(socialDto: SocialDto) {
    const type = socialDto.type;
    if (type === SocialType.GOOGLE) {
      return this.googleAuthProvider.googleAuth(socialDto.token);
    } else if (type === SocialType.GITHUB) {
      return this.githubAuthProvider.githubAuth(socialDto.token);
    } else {
      throw new BadRequestException('Authentication failed');
    }
  }
}
