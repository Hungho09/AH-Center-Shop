import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { CorrelationIdInterceptor, StructuredLogger } from '@ql/logger';
import { GlobalHttpExceptionFilter } from '@ql/exceptions';

async function bootstrap() {
  const logger = new StructuredLogger();
  logger.setServiceName('sales-service');

  const app = await NestFactory.create(AppModule, { logger });

  app.enableShutdownHooks();

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new CorrelationIdInterceptor());
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  const port = process.env.SALES_PORT || process.env.PORT || 3004;
  await app.listen(port);
  logger.log(`Sales Service is running on port ${port} with prefix /api`);
}

bootstrap();

