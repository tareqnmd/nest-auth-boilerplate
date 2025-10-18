import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DATABASE_CONSTANTS } from '../common/constants';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('dbConfig.uri'),
        dbName: configService.get<string>('dbConfig.db'),
        maxPoolSize: configService.get<number>('dbConfig.maxPoolSize'),
        minPoolSize: configService.get<number>('dbConfig.minPoolSize'),
        maxIdleTimeMS: configService.get<number>('dbConfig.maxIdleTimeMS'),
        waitQueueTimeoutMS: configService.get<number>(
          'dbConfig.waitQueueTimeoutMS',
        ),
        serverSelectionTimeoutMS: configService.get<number>(
          'dbConfig.serverSelectionTimeoutMS',
        ),
        socketTimeoutMS: configService.get<number>('dbConfig.socketTimeoutMS'),
        connectTimeoutMS: configService.get<number>(
          'dbConfig.connectTimeoutMS',
        ),
        retryAttempts: DATABASE_CONSTANTS.RETRY_ATTEMPTS,
        retryDelay: DATABASE_CONSTANTS.RETRY_DELAY,
        autoIndex: true,
        autoCreate: true,
        connectionFactory: (connection: Connection) => {
          const logger = new Logger('DatabaseModule');
          let reconnectAttempts = 0;
          const MAX_RECONNECT_ATTEMPTS =
            DATABASE_CONSTANTS.MAX_RECONNECT_ATTEMPTS;
          const RECONNECT_INTERVAL = DATABASE_CONSTANTS.RECONNECT_INTERVAL;

          connection.on('connected', () => {
            reconnectAttempts = 0;
            logger.log('Database connected successfully');
          });

          connection.on('error', (err: Error) => {
            logger.error('Database connection error:', {
              message: err.message,
              stack: err.stack,
            });

            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
              reconnectAttempts++;
              logger.warn(
                `Attempting to reconnect to database... Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`,
              );
              setTimeout(() => {
                connection.asPromise().catch((error: Error) => {
                  logger.error('Reconnection attempt failed:', error);
                });
              }, RECONNECT_INTERVAL);
            } else {
              logger.error(
                'Max reconnection attempts reached. Manual intervention required.',
              );
            }
          });

          connection.on('disconnected', () => {
            logger.warn('Database disconnected. Will attempt to reconnect...');
          });

          connection.on('reconnected', () => {
            reconnectAttempts = 0;
            logger.log('Database reconnected successfully');
          });

          connection.on('reconnectFailed', () => {
            logger.error(
              'Failed to reconnect to database after multiple attempts',
            );
          });

          connection.on('close', () => {
            logger.warn('Database connection closed');
          });

          connection.on('timeout', () => {
            logger.error('Database connection timeout');
          });

          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
