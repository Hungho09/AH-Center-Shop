import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration, validate } from '@ql/config';
import { DatabaseModule } from '@ql/database';
import { MessagingModule } from '@ql/messaging';
import { HoaDonEntity } from './domain/entities/hoa-don.entity';
import { CtHoaDonEntity } from './domain/entities/ct-hoa-don.entity';
import { SalesModule } from './domain/sales.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
      validate,
    }),
    DatabaseModule.forRoot({
      entities: [HoaDonEntity, CtHoaDonEntity],
    }),
    MessagingModule,
    SalesModule,
    HealthModule,
  ],
})
export class AppModule {}

