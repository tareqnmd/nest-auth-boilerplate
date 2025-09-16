import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import socialConfig from 'src/config/social.config';
import { ISocialResponse } from '../interfaces/social-response.interface';

@Injectable()
export class GoogleAuthProvider implements OnModuleInit {
  private oAuthClient: OAuth2Client;
  constructor(
    @Inject(socialConfig.KEY)
    private readonly socialConfiguration: ConfigType<typeof socialConfig>,
  ) {}

  onModuleInit() {
    this.oAuthClient = new OAuth2Client(
      this.socialConfiguration.googleClientId,
      this.socialConfiguration.googleClientSecret,
    );
  }

  async authenticate(token: string) {
    try {
      const ticket = await this.oAuthClient.verifyIdToken({
        idToken: token,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async googleAuth(token: string) {
    try {
      const data = await this.authenticate(token);
      if (!data) {
        throw new UnauthorizedException();
      }
      return {
        firstName: data.given_name,
        lastName: data.family_name,
        email: data.email,
        image: data.picture,
        googleId: data.sub,
      } as ISocialResponse;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
