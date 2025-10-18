import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import * as pino from 'pino';
import { APP_NAME } from '../common/constants';

const getLogLevel = (env: string | undefined): string => {
  switch (env) {
    case 'production':
      return 'info';
    case 'test':
      return 'warn';
    case 'development':
    default:
      return 'debug';
  }
};

const getDevelopmentTransport = () => ({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'yyyy-MM-dd HH:mm:ss.l',
    ignore: 'pid,hostname,context',
    singleLine: false,
    levelFirst: true,
    messageFormat: '{msg}',
    errorLikeObjectKeys: ['err', 'error'],
    errorProps: 'message,stack',
  },
});

const redactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.body.password',
  'req.body.confirmPassword',
  'req.body.token',
  'req.body.refreshToken',
  'req.body.accessToken',
  'req.body.secret',
  'req.body.apiKey',
  'req.body.creditCard',
  'req.body.cvv',
  'req.body.ssn',
  'req.body.otp',
  'req.body.verificationCode',
  'req.body.securityAnswer',
  'req.query.token',
  'req.query.secret',
  'req.query.apiKey',
  'req.query.accessToken',
  'req.query.refreshToken',
  'res.body.password',
  'res.body.token',
  'res.body.accessToken',
  'res.body.refreshToken',
  'res.body.secret',
  'res.body.data.token',
  'res.body.data.accessToken',
  'res.body.data.refreshToken',
  'res.body.data.password',
];

export const loggerConfig = (configService: ConfigService): Params => {
  const env = configService.get<string>('appConfig.env');
  const isDevelopment = env === 'development' || !env;

  return {
    pinoHttp: {
      name: APP_NAME,
      level: getLogLevel(env),
      transport: isDevelopment ? getDevelopmentTransport() : undefined,

      formatters: {
        level: (label: string) => {
          return { level: label.toUpperCase() };
        },
        bindings: (bindings: Record<string, unknown>) => {
          return {
            pid: bindings.pid,
            host: bindings.hostname,
            node_version: process.version,
          };
        },
      },

      timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,

      serializers: {
        err: pino.stdSerializers.err,
        error: pino.stdSerializers.err,
      },

      redact: {
        paths: redactPaths,
        censor: '***REDACTED***',
      },

      base: {
        env,
        application: APP_NAME,
      },

      autoLogging: false,
    },

    exclude: ['/health', '/metrics'],
    forRoutes: [],
  };
};
