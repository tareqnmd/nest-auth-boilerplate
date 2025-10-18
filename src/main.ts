import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { APP_CONSTANTS } from './common/constants';
import { DataResponseExceptionFilter } from './common/filters';
import {
  CorrelationIdInterceptor,
  DataResponseInterceptor,
  LoggingInterceptor,
  TimeoutInterceptor,
} from './common/interceptors';
import { BootstrapLogger, setupProcessHandlers } from './common/utils';
import { getHelmetConfig } from './config/helmet.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    const configService = app.get(ConfigService);
    const logger = app.get(Logger);

    app.useLogger(logger);

    const bootstrapLogger = new BootstrapLogger(logger, configService);
    bootstrapLogger.logApplicationStarting();

    app.use(helmet(getHelmetConfig(configService)));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {},
      }),
    );

    app.enableCors({
      origin: configService.get<string>('appConfig.clientUrl'),
      credentials: true,
    });

    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'api/v',
      defaultVersion: APP_CONSTANTS.DEFAULT_API_VERSION,
    });

    app.useGlobalInterceptors(
      new CorrelationIdInterceptor(),
      new TimeoutInterceptor(configService),
      app.get(LoggingInterceptor),
      new DataResponseInterceptor(),
    );

    app.useGlobalFilters(new DataResponseExceptionFilter(configService));

    setupSwagger(app, configService);

    const port =
      configService.get<number>('appConfig.port') ?? APP_CONSTANTS.DEFAULT_PORT;

    try {
      await app.listen(port);
      bootstrapLogger.logApplicationStarted(port);
    } catch (error) {
      bootstrapLogger.logServerStartError(error, port);
      throw error;
    }
    setupProcessHandlers(app, logger);
  } catch (error) {
    BootstrapLogger.logBootstrapError(error);
    process.exit(1);
  }
}

void bootstrap();
