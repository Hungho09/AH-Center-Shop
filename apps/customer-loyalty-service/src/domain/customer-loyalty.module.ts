import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhachHangEntity } from './entities/khach-hang.entity';
import { HangThanhVienEntity } from './entities/hang-thanh-vien.entity';
import { CustomerLoyaltyController } from './customer-loyalty.controller';
import { CustomerLoyaltyService } from './customer-loyalty.service';

@Module({
  imports: [TypeOrmModule.forFeature([KhachHangEntity, HangThanhVienEntity])],
  controllers: [CustomerLoyaltyController],
  providers: [CustomerLoyaltyService],
  exports: [CustomerLoyaltyService],
})
export class CustomerLoyaltyModule {}

