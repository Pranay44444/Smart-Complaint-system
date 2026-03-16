import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If the controller already returned a shaped response, pass through
        if (
          data &&
          typeof data === 'object' &&
          'success' in data
        ) {
          return data;
        }

        return {
          success: true,
          message: 'Request successful',
          data,
        };
      }),
    );
  }
}
