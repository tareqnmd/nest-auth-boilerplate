import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { RATE_LIMIT_CONSTANTS } from './common/constants';
import { LoggingInterceptor } from './common/interceptors';
import appConfig from './config/app.config';
import cloudinaryConfig from './config/cloudinary.config';
import dbConfig from './config/db.config';
import envValidation from './config/env.validation';
import jwtConfig from './config/jwt.config';
import { loggerConfig } from './config/logger.config';
import mailConfig from './config/mail.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { TokenGuard } from './modules/auth/guards/token.guard';
import { CommunicationModule } from './modules/communication/communication.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { HealthModule } from './modules/health/health.module';
import { TokenModule } from './modules/token/token.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, dbConfig, jwtConfig, cloudinaryConfig, mailConfig],
      validationSchema: envValidation,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: loggerConfig,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: RATE_LIMIT_CONSTANTS.TTL,
        limit: RATE_LIMIT_CONSTANTS.LIMIT,
      },
    ]),
    DatabaseModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    AuthModule,
    UsersModule,
    TokenModule,
    CommunicationModule,
    HealthModule,
    UploadModule,
    ConfigurationModule,
  ],
  providers: [
    LoggingInterceptor,
    TokenGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
