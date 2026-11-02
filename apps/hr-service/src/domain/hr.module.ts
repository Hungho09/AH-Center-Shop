import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChucVuEntity } from './entities/chuc-vu.entity';
import { NhanVienEntity } from './entities/nhan-vien.entity';
import { CaLamViecEntity } from './entities/ca-lam-viec.entity';
import { PhanCaEntity } from './entities/phan-ca.entity';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChucVuEntity, NhanVienEntity, CaLamViecEntity, PhanCaEntity]),
  ],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}
