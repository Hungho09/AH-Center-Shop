import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KhachHangEntity } from './entities/khach-hang.entity';
import { HangThanhVienEntity } from './entities/hang-thanh-vien.entity';
import { RabbitMQService } from '@ql/messaging';
import { QUEUES, ROUTING_KEYS } from '@ql/common';
import { ISalePaidPayload } from '@ql/contracts';

@Injectable()
export class CustomerLoyaltyService {
  private readonly logger = new Logger(CustomerLoyaltyService.name);

  constructor(
    @InjectRepository(KhachHangEntity)
    private readonly khachHangRepo: Repository<KhachHangEntity>,
    @InjectRepository(HangThanhVienEntity)
    private readonly hangThanhVienRepo: Repository<HangThanhVienEntity>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async onModuleInit() {
    // Stage 1 Guideline: Only receive event to sync cache / notifications, DO NOT double-write
    await this.rabbitMQService.subscribe<ISalePaidPayload>(
      QUEUES.CUSTOMER_LOYALTY,
      ROUTING_KEYS.SALE_PAID,
      async envelope => {
        this.logger.log(
          `Received SalePaid event for customer sync: ${envelope.payload.maKhachHang}`,
        );
      },
    );
  }

  async findAllCustomers(page = 1, limit = 20, search?: string) {
    const query = this.khachHangRepo
      .createQueryBuilder('kh')
      .leftJoinAndSelect('kh.hangThanhVien', 'hang');

    if (search) {
      query.where('kh.TenKhachHang LIKE :search OR kh.SoDienThoai LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findCustomerById(id: string) {
    const item = await this.khachHangRepo.findOne({
      where: { maKhachHang: id },
      relations: ['hangThanhVien'],
    });
    if (!item) {
      throw new NotFoundException(`Khách hàng với mã '${id}' không tồn tại`);
    }
    return item;
  }

  async findCustomerByPhone(phone: string) {
    const item = await this.khachHangRepo.findOne({
      where: { soDienThoai: phone },
      relations: ['hangThanhVien'],
    });
    if (!item) {
      throw new NotFoundException(`Khách hàng với số điện thoại '${phone}' không tồn tại`);
    }
    return item;
  }

  async findAllTiers() {
    return this.hangThanhVienRepo.find({
      order: { nguongChiTieu: 'ASC' },
    });
  }
}
