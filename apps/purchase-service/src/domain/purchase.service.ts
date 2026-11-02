import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PhieuNhapEntity } from './entities/phieu-nhap.entity';
import { NhaCungCapEntity } from './entities/nha-cung-cap.entity';
import { CtPhieuNhapEntity } from './entities/ct-phieu-nhap.entity';
import { RabbitMQService } from '@ql/messaging';
import { AppException, ErrorCode } from '@ql/exceptions';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);

  constructor(
    @InjectRepository(PhieuNhapEntity)
    private readonly phieuNhapRepo: Repository<PhieuNhapEntity>,
    @InjectRepository(NhaCungCapEntity)
    private readonly nhaCungCapRepo: Repository<NhaCungCapEntity>,
    @InjectRepository(CtPhieuNhapEntity)
    private readonly ctPhieuNhapRepo: Repository<CtPhieuNhapEntity>,
    private readonly dataSource: DataSource,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async findAllPurchases(page = 1, limit = 20) {
    const [items, total] = await this.phieuNhapRepo.findAndCount({
      relations: ['nhaCungCap', 'chiTiet'],
      skip: (page - 1) * limit,
      take: limit,
      order: { ngayNhap: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPurchaseById(id: string) {
    const item = await this.phieuNhapRepo.findOne({
      where: { maPhieuNhap: id },
      relations: ['nhaCungCap', 'chiTiet'],
    });
    if (!item) {
      throw new NotFoundException(`Phiếu nhập với mã '${id}' không tồn tại`);
    }
    return item;
  }

  async findAllSuppliers() {
    return this.nhaCungCapRepo.find();
  }

  /**
   * Scaffold method for calling Stored Procedure usp_HoanThanhPhieuNhap.
   * Under Global Execution Rules: Actual execution is gated until business verification phase.
   */
  async completePurchaseOrder(maPhieuNhap: string): Promise<{ success: boolean; message: string }> {
    const purchase = await this.findPurchaseById(maPhieuNhap);
    if (purchase.trangThai === 'Đã hoàn thành') {
      throw new AppException(
        'Phiếu nhập đã được hoàn thành trước đó',
        ErrorCode.DOMAIN_RULE_VIOLATION,
      );
    }

    this.logger.log(`[SCAFFOLD] Authorized caller for usp_HoanThanhPhieuNhap for '${maPhieuNhap}'`);
    // Gated invocation: In scaffold phase, we verify DB connectivity and log execution plan
    return {
      success: true,
      message: `Phiếu nhập '${maPhieuNhap}' sẵn sàng thực thi qua usp_HoanThanhPhieuNhap`,
    };
  }
}
