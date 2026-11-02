import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HoaDonEntity } from './entities/hoa-don.entity';
import { CtHoaDonEntity } from './entities/ct-hoa-don.entity';
import { RabbitMQService } from '@ql/messaging';
import { AppException, ErrorCode } from '@ql/exceptions';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    @InjectRepository(HoaDonEntity)
    private readonly hoaDonRepo: Repository<HoaDonEntity>,
    @InjectRepository(CtHoaDonEntity)
    private readonly ctHoaDonRepo: Repository<CtHoaDonEntity>,
    private readonly dataSource: DataSource,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async findAllInvoices(page = 1, limit = 20) {
    const [items, total] = await this.hoaDonRepo.findAndCount({
      relations: ['chiTiet'],
      skip: (page - 1) * limit,
      take: limit,
      order: { ngayLap: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findInvoiceById(id: string) {
    const item = await this.hoaDonRepo.findOne({
      where: { maHoaDon: id },
      relations: ['chiTiet'],
    });
    if (!item) {
      throw new NotFoundException(`Hoá đơn với mã '${id}' không tồn tại`);
    }
    return item;
  }

  /**
   * Scaffold method for calling Stored Procedure usp_ThanhToanHoaDon.
   * Under Global Execution Rules: Actual write execution is gated until business verification phase.
   */
  async processPayment(maHoaDon: string): Promise<{ success: boolean; message: string }> {
    const invoice = await this.findInvoiceById(maHoaDon);
    if (invoice.trangThai === 'Đã thanh toán') {
      throw new AppException(
        'Hoá đơn đã được thanh toán trước đó',
        ErrorCode.DOMAIN_RULE_VIOLATION,
      );
    }

    this.logger.log(`[SCAFFOLD] Authorized caller for usp_ThanhToanHoaDon for '${maHoaDon}'`);
    // Gated invocation: In scaffold phase, we verify DB connectivity and return readiness response
    return {
      success: true,
      message: `Hoá đơn '${maHoaDon}' sẵn sàng xử lý thanh toán qua usp_ThanhToanHoaDon`,
    };
  }
}
