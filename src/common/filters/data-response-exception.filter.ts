import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { CORRELATION_ID_HEADER } from '../interceptors/correlation-id.interceptor';
import { ApiResponse } from '../interfaces';

interface ExceptionWithStatusCode {
  statusCode?: number;
  message?: string | string[];
}

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
}

@Catch()
export class DataResponseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DataResponseExceptionFilter.name);
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProduction =
      this.configService.get<string>('appConfig.env') === 'production';
  }

  catch(
    exception: HttpException | ExceptionWithStatusCode | Error,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const handledException = this.handleMongooseErrors(exception);

    const status: number = this.getStatusCode(handledException);
    const message: string | string[] = this.getMessage(
      handledException,
      status,
    );

    const correlationId =
      (request as unknown as { correlationId?: string }).correlationId ||
      (
        request.headers as unknown as Record<
          string,
          string | string[] | undefined
        >
      )[CORRELATION_ID_HEADER];

    this.logError(handledException, request, status, correlationId);

    const apiResponse: ApiResponse<null> = {
      data: null,
      message,
      status,
      error: true,
    };

    if (correlationId) {
      response.setHeader(CORRELATION_ID_HEADER, correlationId);
    }

    response.status(status).json(apiResponse);
  }

  private getStatusCode(
    exception: HttpException | ExceptionWithStatusCode | Error,
  ): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    if ('statusCode' in exception && typeof exception.statusCode === 'number') {
      return exception.statusCode;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(
    exception: HttpException | ExceptionWithStatusCode | Error,
    status: number,
  ): string | string[] {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const responseObj = response as { message?: string | string[] };
        return responseObj.message || 'Internal server error';
      }
    }

    if (this.isProduction) {
      if (status >= 500) {
        return 'Internal server error';
      }

      if ('message' in exception && exception.message) {
        return exception.message;
      }
      return 'Bad request';
    }

    if ('message' in exception && exception.message) {
      return exception.message;
    }
    return 'Internal server error';
  }

  private handleMongooseErrors(
    exception: HttpException | ExceptionWithStatusCode | Error,
  ): HttpException | ExceptionWithStatusCode | Error {
    if (
      exception instanceof MongooseError.CastError ||
      (exception as MongooseError.CastError).name === 'CastError'
    ) {
      return new BadRequestException(
        `Invalid ID format for field: ${(exception as MongooseError.CastError).path}`,
      );
    }

    if (
      exception instanceof MongooseError.ValidationError ||
      (exception as MongooseError.ValidationError).name === 'ValidationError'
    ) {
      const validationError = exception as MongooseError.ValidationError;
      const messages = Object.values(validationError.errors || {}).map(
        (err) => err.message,
      );
      return new BadRequestException(
        messages.length > 0 ? messages : 'Validation error',
      );
    }

    const mongoError = exception as MongoError;
    if (mongoError.code === 11000) {
      const field = Object.keys(mongoError.keyPattern || {})[0];
      const value = mongoError.keyValue
        ? mongoError.keyValue[field]
        : 'unknown';
      return new ConflictException(
        `A record with ${field}: '${value as string}' already exists`,
      );
    }

    return exception;
  }

  private logError(
    exception: HttpException | ExceptionWithStatusCode | Error,
    request: Request,
    status: number,
    correlationId?: string | string[],
  ): void {
    const errorType =
      exception.constructor?.name !== 'Object'
        ? exception.constructor?.name
        : 'Error';

    const errorDetails = {
      timestamp: new Date().toISOString(),
      correlationId,
      path: request.url,
      method: request.method,
      statusCode: status,
      errorType,
      message:
        'message' in exception ? exception.message : 'Unknown error occurred',
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    if (status >= 500) {
      this.logger.error({
        type: 'server-error',
        ...errorDetails,
      });
    } else if (status === 401 || status === 403) {
      this.logger.debug({
        type: 'auth-error',
        correlationId: errorDetails.correlationId,
        path: errorDetails.path,
        method: errorDetails.method,
        statusCode: errorDetails.statusCode,
        errorType: errorDetails.errorType,
      });
    } else if (status === 404) {
      this.logger.debug({
        type: 'not-found',
        correlationId: errorDetails.correlationId,
        path: errorDetails.path,
        method: errorDetails.method,
        statusCode: errorDetails.statusCode,
      });
    } else {
      this.logger.warn({
        type: 'client-error',
        correlationId: errorDetails.correlationId,
        path: errorDetails.path,
        method: errorDetails.method,
        statusCode: errorDetails.statusCode,
        errorType: errorDetails.errorType,
        message: errorDetails.message,
      });
    }
  }
}
