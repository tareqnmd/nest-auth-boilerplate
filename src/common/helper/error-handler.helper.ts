import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export class ErrorHandlerHelper {
  static handleError(
    error: unknown,
    logger: Logger,
    errorMessage: string,
  ): never {
    if (error instanceof HttpException) {
      throw error;
    }
    logger.error(errorMessage, error);
    throw new InternalServerErrorException(errorMessage);
  }
}
