import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration, validate } from '@ql/config';
import { DatabaseModule } from '@ql/database';
import { MessagingModule } from '@ql/messaging';
import { KhachHangEntity } from './domain/entities/khach-hang.entity';
import { HangThanhVienEntity } from './domain/entities/hang-thanh-vien.entity';
import { CustomerLoyaltyModule } from './domain/customer-loyalty.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
      validate,
    }),
    DatabaseModule.forRoot({
      entities: [KhachHangEntity, HangThanhVienEntity],
    }),
    MessagingModule,
    CustomerLoyaltyModule,
    HealthModule,
  ],
})
export class AppModule {}

