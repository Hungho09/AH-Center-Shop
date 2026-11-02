import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhieuHuyEntity } from './entities/phieu-huy.entity';
import { InventoryLossController } from './inventory-loss.controller';
import { InventoryLossService } from './inventory-loss.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhieuHuyEntity])],
  controllers: [InventoryLossController],
  providers: [InventoryLossService],
  exports: [InventoryLossService],
})
export class InventoryLossModule {}

