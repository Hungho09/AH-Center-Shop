import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration, validate } from '@ql/config';
import { DatabaseModule } from '@ql/database';
import { MessagingModule } from '@ql/messaging';
import { PhieuHuyEntity } from './domain/entities/phieu-huy.entity';
import { InventoryLossModule } from './domain/inventory-loss.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
      validate,
    }),
    DatabaseModule.forRoot({
      entities: [PhieuHuyEntity],
    }),
    MessagingModule,
    InventoryLossModule,
    HealthModule,
  ],
})
export class AppModule {}

