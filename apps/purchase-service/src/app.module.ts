import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration, validate } from '@ql/config';
import { DatabaseModule } from '@ql/database';
import { MessagingModule } from '@ql/messaging';
import { NhaCungCapEntity } from './domain/entities/nha-cung-cap.entity';
import { PhieuNhapEntity } from './domain/entities/phieu-nhap.entity';
import { CtPhieuNhapEntity } from './domain/entities/ct-phieu-nhap.entity';
import { PurchaseModule } from './domain/purchase.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
      validate,
    }),
    DatabaseModule.forRoot({
      entities: [NhaCungCapEntity, PhieuNhapEntity, CtPhieuNhapEntity],
    }),
    MessagingModule,
    PurchaseModule,
    HealthModule,
  ],
})
export class AppModule {}

