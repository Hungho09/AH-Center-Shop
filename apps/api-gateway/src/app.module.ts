import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration, validate } from '@ql/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
      validate,
    }),
    HealthModule,
    AuthModule,
    ProxyModule,
  ],
})
export class AppModule {}

