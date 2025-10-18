import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { ApiResponse, IMeta } from '../interfaces';

@Injectable()
export class DataResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: T) => {
        const isObject = data && typeof data === 'object';
        const dataObj = isObject ? (data as Record<string, unknown>) : {};

        const resultData: T | null =
          isObject && 'data' in dataObj ? (dataObj.data as T) : (data ?? null);

        const resultMessage: string | string[] =
          (dataObj.message as string | string[]) ||
          'Request completed successfully';

        const result: ApiResponse<T> = {
          data: resultData,
          message: resultMessage,
          status: response.statusCode,
          error: false,
        };

        if (dataObj.meta && typeof dataObj.meta === 'object') {
          result.meta = dataObj.meta as IMeta;
        }

        return result;
      }),
    );
  }
}
