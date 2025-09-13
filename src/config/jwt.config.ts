import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  secret: process.env.JWT_TOKEN_SECRET,
  accessTokenTTL: process.env.JWT_ACCESS_TOKEN_TTL,
  refreshTokenTTL: process.env.JWT_REFRESH_TOKEN_TTL,
}));
