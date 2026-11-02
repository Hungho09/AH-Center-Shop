import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NhaCungCapEntity } from './entities/nha-cung-cap.entity';
import { PhieuNhapEntity } from './entities/phieu-nhap.entity';
import { CtPhieuNhapEntity } from './entities/ct-phieu-nhap.entity';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [TypeOrmModule.forFeature([NhaCungCapEntity, PhieuNhapEntity, CtPhieuNhapEntity])],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}

