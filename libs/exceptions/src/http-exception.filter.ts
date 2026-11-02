import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse, HEADER_CORRELATION_ID } from '@ql/common';
import { AppException } from './app-exception';
import { ErrorCode } from './error-codes.enum';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { correlationId?: string }>();

    const correlationId =
      request.correlationId ||
      (request.headers?.[HEADER_CORRELATION_ID] as string) ||
      'unknown-correlation';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    let message = 'Đã có lỗi hệ thống xảy ra';
    let details: any = undefined;

    if (exception instanceof AppException) {
      status = exception.getStatus();
      errorCode = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        const anyRes = res as any;
        message = anyRes.message || exception.message;
        errorCode =
          status === HttpStatus.UNAUTHORIZED
            ? ErrorCode.UNAUTHORIZED
            : status === HttpStatus.FORBIDDEN
              ? ErrorCode.FORBIDDEN
              : status === HttpStatus.NOT_FOUND
                ? ErrorCode.RESOURCE_NOT_FOUND
                : status === HttpStatus.BAD_REQUEST
                  ? ErrorCode.VALIDATION_FAILED
                  : ErrorCode.INTERNAL_SERVER_ERROR;
        details = anyRes.error || anyRes.message;
      } else {
        message = String(res);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
    }

    const payload: ApiResponse = {
      success: false,
      statusCode: status,
      message,
      error: {
        code: errorCode,
        details,
        timestamp: new Date().toISOString(),
        path: request.url,
        correlationId,
      },
    };

    response.status(status).json(payload);
  }
}
