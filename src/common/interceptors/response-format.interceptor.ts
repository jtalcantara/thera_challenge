import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  success: boolean;
  data: T;
  errors: any;
}

@Injectable()
export class ResponseFormatInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data,
        errors: null,
      })),
    );
  }
}
