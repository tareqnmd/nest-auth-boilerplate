import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import envValidation from './config/env.validation';
import jwtConfig from './config/jwt.config';
import socialConfig from './config/social.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, dbConfig, jwtConfig, socialConfig],
      validationSchema: envValidation,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
