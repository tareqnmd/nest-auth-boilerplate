import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  secret: process.env.JWT_TOKEN_SECRET,
  accessTokenTTL: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10),
  refreshTokenTTL: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400', 10),
}));
