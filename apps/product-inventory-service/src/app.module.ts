import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration, validate } from '@ql/config';
import { DatabaseModule } from '@ql/database';
import { MessagingModule } from '@ql/messaging';
import { HangHoaEntity } from './domain/entities/hang-hoa.entity';
import { LoaiHangEntity } from './domain/entities/loai-hang.entity';
import { ProductModule } from './domain/product.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
      validate,
    }),
    DatabaseModule.forRoot({
      entities: [HangHoaEntity, LoaiHangEntity],
    }),
    MessagingModule,
    ProductModule,
    HealthModule,
  ],
})
export class AppModule {}

