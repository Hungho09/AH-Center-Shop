import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhieuHuyEntity } from './entities/phieu-huy.entity';
import { RabbitMQService } from '@ql/messaging';
import { ROUTING_KEYS } from '@ql/common';
import { IStockOutRequestedPayload } from '@ql/contracts';
import { randomUUID } from 'crypto';

@Injectable()
export class InventoryLossService {
  private readonly logger = new Logger(InventoryLossService.name);

  constructor(
    @InjectRepository(PhieuHuyEntity)
    private readonly phieuHuyRepo: Repository<PhieuHuyEntity>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async findAllLossRecords(page = 1, limit = 20) {
    const [items, total] = await this.phieuHuyRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { ngayHuy: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findLossRecordById(id: string) {
    const item = await this.phieuHuyRepo.findOne({
      where: { maPhieuHuy: id },
    });
    if (!item) {
      throw new NotFoundException(`Phiếu hủy hàng với mã '${id}' không tồn tại`);
    }
    return item;
  }

  /**
   * Scaffold method to dispatch StockOutRequested when inventory loss is approved
   */
  async dispatchStockOutForLoss(lossRecord: PhieuHuyEntity) {
    const payload: IStockOutRequestedPayload = {
      idempotencyKey: `LOSS_${lossRecord.maPhieuHuy}_${randomUUID()}`,
      maHang: lossRecord.maHang,
      soLuong: lossRecord.soLuongHuy,
      sourceId: lossRecord.maPhieuHuy,
      sourceType: 'PHIEUHUY',
    };

    await this.rabbitMQService.publish(ROUTING_KEYS.STOCK_OUT_REQUESTED, payload);
    this.logger.log(`Published StockOutRequested for loss record '${lossRecord.maPhieuHuy}'`);
  }
}

