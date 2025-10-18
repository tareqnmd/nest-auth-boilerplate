import { registerAs } from '@nestjs/config';
import { APP_CONSTANTS } from '../common/constants';

export default registerAs('appConfig', () => ({
  port: parseInt(
    process.env.PORT ?? String(APP_CONSTANTS.DEFAULT_PORT),
    APP_CONSTANTS.RADIX,
  ),
  env: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  requestTimeout: APP_CONSTANTS.DEFAULT_REQUEST_TIMEOUT,
}));
