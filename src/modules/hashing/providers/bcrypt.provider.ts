import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HASHING_CONSTANTS } from '../../../common/constants';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(HASHING_CONSTANTS.BCRYPT_SALT_ROUNDS);
    const hash = await bcrypt.hash(data, salt);
    return hash;
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    const result = await bcrypt.compare(data, hashedData);
    return result;
  }
}
