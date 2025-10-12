import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    return next.handle().pipe(
      map((data: T) => {
        if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
          const response = context.switchToHttp().getResponse<Response>();
          let statusCode = response.statusCode;

          if (method === 'DELETE' && statusCode === 204) {
            statusCode = 200;
            response.status(statusCode);
          }

          return {
            statusCode,
            message: 'Operation successful',
          };
        }
        return data;
      }),
    );
  }
}
