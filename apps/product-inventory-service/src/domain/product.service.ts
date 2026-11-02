import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HangHoaEntity } from './entities/hang-hoa.entity';
import { LoaiHangEntity } from './entities/loai-hang.entity';
import { RabbitMQService } from '@ql/messaging';
import { QUEUES, ROUTING_KEYS } from '@ql/common';
import { IStockInRequestedPayload, IStockOutRequestedPayload } from '@ql/contracts';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(HangHoaEntity)
    private readonly hangHoaRepo: Repository<HangHoaEntity>,
    @InjectRepository(LoaiHangEntity)
    private readonly loaiHangRepo: Repository<LoaiHangEntity>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async onModuleInit() {
    // Scaffold event subscriptions
    await this.rabbitMQService.subscribe<IStockInRequestedPayload>(
      QUEUES.PRODUCT_INVENTORY,
      ROUTING_KEYS.STOCK_IN_REQUESTED,
      async envelope => {
        this.logger.log(`Received StockInRequested event: ${envelope.payload.idempotencyKey}`);
      },
    );

    await this.rabbitMQService.subscribe<IStockOutRequestedPayload>(
      QUEUES.PRODUCT_INVENTORY,
      ROUTING_KEYS.STOCK_OUT_REQUESTED,
      async envelope => {
        this.logger.log(`Received StockOutRequested event: ${envelope.payload.idempotencyKey}`);
      },
    );
  }

  async findAllProducts(page = 1, limit = 20, search?: string) {
    const query = this.hangHoaRepo
      .createQueryBuilder('hangHoa')
      .leftJoinAndSelect('hangHoa.loaiHang', 'loaiHang');
    if (search) {
      query.where('hangHoa.TenHang LIKE :search OR hangHoa.MaHang LIKE :search', {
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

  async findProductById(id: string) {
    const item = await this.hangHoaRepo.findOne({
      where: { maHang: id },
      relations: ['loaiHang'],
    });
    if (!item) {
      throw new NotFoundException(`Hàng hoá với mã '${id}' không tồn tại`);
    }
    return item;
  }

  async findAllCategories() {
    return this.loaiHangRepo.find();
  }

  async checkStock(id: string) {
    const item = await this.hangHoaRepo.findOne({
      select: ['maHang', 'tenHang', 'soLuongTon'],
      where: { maHang: id },
    });
    if (!item) {
      throw new NotFoundException(`Hàng hoá với mã '${id}' không tồn tại`);
    }
    return {
      maHang: item.maHang,
      tenHang: item.tenHang,
      soLuongTon: item.soLuongTon,
      available: item.soLuongTon > 0,
    };
  }
}
