import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { APP_CONSTANTS } from '../constants';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeoutValue: number;

  constructor(private readonly configService: ConfigService) {
    this.timeoutValue =
      this.configService.get<number>('appConfig.requestTimeout') ??
      APP_CONSTANTS.DEFAULT_REQUEST_TIMEOUT;
  }

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(this.timeoutValue),
      catchError((error: Error) => {
        if (error instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                `Request timeout exceeded ${this.timeoutValue}ms`,
              ),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
