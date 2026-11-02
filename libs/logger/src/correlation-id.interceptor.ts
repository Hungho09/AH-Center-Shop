import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HEADER_CORRELATION_ID, HEADER_REQUEST_ID } from '@ql/common';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const correlationId = (req.headers[HEADER_CORRELATION_ID] as string) || randomUUID();
    const requestId = (req.headers[HEADER_REQUEST_ID] as string) || randomUUID();

    req.correlationId = correlationId;
    req.requestId = requestId;

    if (res && res.setHeader) {
      res.setHeader(HEADER_CORRELATION_ID, correlationId);
      res.setHeader(HEADER_REQUEST_ID, requestId);
    }

    return next.handle();
  }
}
