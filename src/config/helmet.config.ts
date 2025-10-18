import { ConfigService } from '@nestjs/config';
import { HelmetOptions } from 'helmet';

export function getHelmetConfig(configService: ConfigService): HelmetOptions {
  const env = configService.get<string>('appConfig.env');
  const isDevelopment = env !== 'production';

  return {
    contentSecurityPolicy: isDevelopment
      ? {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
            fontSrc: ["'self'", 'data:'],
            connectSrc: ["'self'"],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: [],
          },
        }
      : {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            fontSrc: ["'self'", 'data:'],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: [],
          },
        },

    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },

    dnsPrefetchControl: { allow: false },

    noSniff: true,

    frameguard: { action: 'deny' },

    hidePoweredBy: true,

    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },

    ieNoOpen: true,

    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

    permittedCrossDomainPolicies: { permittedPolicies: 'none' },

    xssFilter: true,
  };
}
