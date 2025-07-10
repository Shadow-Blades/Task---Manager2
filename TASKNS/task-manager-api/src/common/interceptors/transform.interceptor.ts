import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data has a message property, use it, otherwise use a default message
        const message = data?.message || 'Success';
        
        // Remove the message from the data object if it exists
        if (data && typeof data === 'object' && 'message' in data) {
          const { message, ...rest } = data;
          return {
            success: true,
            message,
            data: rest,
          };
        }
        
        return {
          success: true,
          message,
          data,
        };
      }),
    );
  }
} 