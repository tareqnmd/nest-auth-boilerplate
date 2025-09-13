import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  port: parseInt(process.env.PORT ?? '3201', 10),
  env: process.env.NODE_ENV,
}));
