import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface RequestWithUser extends Request {
  user?: {
    sub?: string;
    id?: string;
    [key: string]: unknown;
  };
  correlationId?: string;
}

interface ErrorResponse {
  status?: number;
  statusCode?: number;
  message?: string | string[];
  stack?: string;
  name?: string;
  response?: Record<string, unknown>;
  getStatus?: () => number;
  getResponse?: () => Record<string, unknown> | string;
  constructor?: { name?: string };
  [key: string]: unknown;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestWithUser>();
    const response = ctx.getResponse<Response>();
    const { method, url, headers, query, params } = request;

    const correlationId =
      request.correlationId ||
      (Array.isArray(headers['x-correlation-id'])
        ? headers['x-correlation-id'][0]
        : headers['x-correlation-id']) ||
      'unknown';

    const ip =
      (headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (headers['x-real-ip'] as string) ||
      request.ip ||
      'unknown';

    const userAgent = headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    const user = request.user;
    const userId = user?.sub ?? user?.id ?? 'anonymous';

    this.logger.info({
      correlationId,
      type: 'request',
      method,
      url,
      ip,
      userAgent,
      userId,
      body: this.sanitizeBody(request.body as unknown),
      query,
      params,
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.logger.info({
          correlationId,
          type: 'response',
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          userId,
        });
      }),
      catchError((error: ErrorResponse) => {
        const duration = Date.now() - startTime;

        // Handle different error types properly
        let statusCode: number;
        let errorMessage: string | string[];
        let errorStack: string | undefined;
        let errorType: string;

        if (error?.getStatus && typeof error.getStatus === 'function') {
          // NestJS HttpException
          statusCode = error.getStatus();
          const response = error.getResponse?.();
          errorMessage =
            typeof response === 'string'
              ? response
              : ((response as Record<string, unknown>)?.message as string) ||
                error.message ||
                'Unknown error';
          errorStack = error.stack;
          errorType = error.constructor?.name || 'HttpException';
        } else if (error?.status || error?.statusCode) {
          // Error with status code
          statusCode = error.status || error.statusCode || 500;
          errorMessage = error.message || 'Unknown error';
          errorStack = error.stack;
          errorType = error.constructor?.name || 'Error';
        } else {
          // Generic error
          statusCode = 500;
          errorMessage = error?.message || 'Internal server error';
          errorStack = error?.stack;
          errorType = error?.constructor?.name || 'Error';
        }

        this.logger.error({
          correlationId,
          type: 'error_response',
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          userId,
          error: errorMessage,
          errorType,
          stack: errorStack,
          // Include full error object for debugging (sanitized)
          errorDetails: {
            name: error?.name,
            message: error?.message,
            ...(error?.response && {
              response: error.response,
            }),
          },
        });

        return throwError(() => error);
      }),
    );
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object' || body === null) {
      return body;
    }

    const sensitiveFields = [
      'password',
      'confirmPassword',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'apiKey',
      'creditCard',
      'cvv',
      'ssn',
    ];

    const sanitized = { ...(body as Record<string, unknown>) };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
