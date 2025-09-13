import { Injectable } from '@nestjs/common';
import { SocialDto } from '../dto/social.dto';

@Injectable()
export class SocialProvider {
  constructor() {}

  social(socialDto: SocialDto) {
    return socialDto;
  }
}
