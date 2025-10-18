import { registerAs } from '@nestjs/config';
import { APP_CONSTANTS, JWT_CONSTANTS } from '../common/constants';

export default registerAs('jwtConfig', () => ({
  secret: process.env.JWT_TOKEN_SECRET,
  accessTokenTTL: parseInt(
    process.env.JWT_ACCESS_TOKEN_TTL ??
      String(JWT_CONSTANTS.DEFAULT_ACCESS_TOKEN_TTL),
    APP_CONSTANTS.RADIX,
  ),
  userTokenTTL: parseInt(
    process.env.USER_TOKEN_TTL ?? String(JWT_CONSTANTS.DEFAULT_USER_TOKEN_TTL),
    APP_CONSTANTS.RADIX,
  ),
  refreshTokenTTL: parseInt(
    process.env.JWT_REFRESH_TOKEN_TTL ??
      String(JWT_CONSTANTS.DEFAULT_REFRESH_TOKEN_TTL),
    APP_CONSTANTS.RADIX,
  ),
}));
