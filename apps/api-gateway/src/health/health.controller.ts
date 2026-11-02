import { Controller, Get } from '@nestjs/common';
import { HealthStatus, Public } from '@ql/common';

@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  @Get()
  @Public()
  check(): HealthStatus {
    return {
      status: 'ok',
      service: 'api-gateway',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      dependencies: {
        database: 'not_configured', // Gateway has no direct DB
      },
    };
  }
}

