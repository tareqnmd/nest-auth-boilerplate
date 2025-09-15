import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import socialConfig from 'src/config/social.config';

@Injectable()
export class GoogleAuthProvider {
  constructor(
    @Inject(socialConfig.KEY)
    private readonly socialConfiguration: ConfigType<typeof socialConfig>,
  ) {}

  googleAuth(token: string) {
    return { token };
  }

  authenticate(token: string) {
    return { token };
  }
}
