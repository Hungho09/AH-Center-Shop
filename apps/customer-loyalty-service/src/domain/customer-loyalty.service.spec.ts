import { CustomerLoyaltyService } from './customer-loyalty.service';

describe('CustomerLoyaltyService', () => {
  let service: CustomerLoyaltyService;
  let mockKhachHangRepo: any;
  let mockHangThanhVienRepo: any;
  let mockRabbitMQService: any;

  beforeEach(() => {
    mockKhachHangRepo = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };
    mockHangThanhVienRepo = {
      find: jest.fn().mockResolvedValue([
        { maHang: 'DONG', tenHang: 'Đồng', nguongChiTieu: 0 },
        { maHang: 'BAC', tenHang: 'Bạc', nguongChiTieu: 2000000 },
        { maHang: 'VANG', tenHang: 'Vàng', nguongChiTieu: 8000000 },
      ]),
    };
    mockRabbitMQService = {
      subscribe: jest.fn(),
    };

    service = new CustomerLoyaltyService(
      mockKhachHangRepo,
      mockHangThanhVienRepo,
      mockRabbitMQService,
    );
  });

  it('should find all tiers successfully', async () => {
    const tiers = await service.findAllTiers();
    expect(tiers).toHaveLength(3);
    expect(tiers[0].maHang).toBe('DONG');
  });
});

