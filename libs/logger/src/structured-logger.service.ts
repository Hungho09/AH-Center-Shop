import { Injectable, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT })
export class StructuredLogger implements LoggerService {
  private serviceName: string = 'app';

  setServiceName(name: string) {
    this.serviceName = name;
  }

  private formatMessage(level: string, message: any, context?: string, correlationId?: string) {
    const logObject = {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      level,
      context: context || 'Application',
      correlationId: correlationId || undefined,
      message,
    };
    return JSON.stringify(logObject);
  }

  log(message: any, context?: string, correlationId?: string) {
    console.log(this.formatMessage('INFO', message, context, correlationId));
  }

  error(message: any, trace?: string, context?: string, correlationId?: string) {
    console.error(
      this.formatMessage(
        'ERROR',
        typeof message === 'object' ? { ...message, stack: trace } : `${message} - ${trace || ''}`,
        context,
        correlationId,
      ),
    );
  }

  warn(message: any, context?: string, correlationId?: string) {
    console.warn(this.formatMessage('WARN', message, context, correlationId));
  }

  debug?(message: any, context?: string, correlationId?: string) {
    console.debug(this.formatMessage('DEBUG', message, context, correlationId));
  }

  verbose?(message: any, context?: string, correlationId?: string) {
    console.log(this.formatMessage('VERBOSE', message, context, correlationId));
  }
}

