import { Controller, Get } from '@nestjs/common';
import { HealthStatus, Public } from '@ql/common';
import { DataSource } from 'typeorm';
import { RabbitMQService } from '@ql/messaging';

@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  constructor(
    private readonly dataSource: DataSource,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Get()
  @Public()
  check(): HealthStatus {
    const isDbConnected = this.dataSource.isInitialized;
    return {
      status: isDbConnected ? 'ok' : 'error',
      service: 'hr-service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      dependencies: {
        database: isDbConnected ? 'connected' : 'disconnected',
        rabbitmq: this.rabbitMQService.healthStatus,
      },
    };
  }
}

