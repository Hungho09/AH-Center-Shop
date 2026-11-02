import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration, validate } from '@ql/config';
import { DatabaseModule } from '@ql/database';
import { MessagingModule } from '@ql/messaging';
import { ChucVuEntity } from './domain/entities/chuc-vu.entity';
import { NhanVienEntity } from './domain/entities/nhan-vien.entity';
import { CaLamViecEntity } from './domain/entities/ca-lam-viec.entity';
import { PhanCaEntity } from './domain/entities/phan-ca.entity';
import { HrModule } from './domain/hr.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
      validate,
    }),
    DatabaseModule.forRoot({
      entities: [ChucVuEntity, NhanVienEntity, CaLamViecEntity, PhanCaEntity],
    }),
    MessagingModule,
    HrModule,
    HealthModule,
  ],
})
export class AppModule {}

