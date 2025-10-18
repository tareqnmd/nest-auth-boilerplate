import { INestApplication } from '@nestjs/common';
import { PROCESS_EXIT_CODES, PROCESS_TIMEOUTS } from '../constants';

interface LoggerLike {
  log: (message: string, ...optionalParams: unknown[]) => void;
  error: (message: string, ...optionalParams: unknown[]) => void;
  warn: (message: string, ...optionalParams: unknown[]) => void;
}

export function setupGracefulShutdown(
  app: INestApplication,
  logger: LoggerLike,
): void {
  const gracefulShutdown = async (signal: string) => {
    logger.warn(`Received ${signal}, closing application gracefully...`);

    const timeout = setTimeout(() => {
      logger.error(
        'Graceful shutdown timeout exceeded, forcing exit after 30 seconds',
      );
      process.exit(PROCESS_EXIT_CODES.FAILURE);
    }, PROCESS_TIMEOUTS.GRACEFUL_SHUTDOWN);

    try {
      await app.close();
      clearTimeout(timeout);
      logger.log('Application closed successfully');
      process.exit(PROCESS_EXIT_CODES.SUCCESS);
    } catch (error) {
      clearTimeout(timeout);
      logger.error('Error during graceful shutdown:', error);
      process.exit(PROCESS_EXIT_CODES.FAILURE);
    }
  };

  process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => void gracefulShutdown('SIGINT'));
}

export function setupGlobalErrorHandlers(logger: LoggerLike): void {
  process.on(
    'unhandledRejection',
    (reason: Error, promise: Promise<unknown>) => {
      logger.error('Unhandled Promise Rejection:', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
        promise,
      });
    },
  );

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(PROCESS_EXIT_CODES.FAILURE);
  });
}

export function setupProcessHandlers(
  app: INestApplication,
  logger: LoggerLike,
): void {
  setupGracefulShutdown(app, logger);
  setupGlobalErrorHandlers(logger);
}
