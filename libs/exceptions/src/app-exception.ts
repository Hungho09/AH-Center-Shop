import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes.enum';

export class AppException extends HttpException {
  public readonly code: ErrorCode;
  public readonly details?: any;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(message, statusCode);
    this.code = code;
    this.details = details;
  }
}

export class NotFoundAppException extends AppException {
  constructor(message: string, details?: any) {
    super(message, ErrorCode.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

export class ValidationAppException extends AppException {
  constructor(message: string, details?: any) {
    super(message, ErrorCode.VALIDATION_FAILED, HttpStatus.BAD_REQUEST, details);
  }
}

export class InsufficientStockException extends AppException {
  constructor(message: string = 'Số lượng tồn kho không đủ để thực hiện thao tác', details?: any) {
    super(message, ErrorCode.INSUFFICIENT_STOCK, HttpStatus.CONFLICT, details);
  }
}

