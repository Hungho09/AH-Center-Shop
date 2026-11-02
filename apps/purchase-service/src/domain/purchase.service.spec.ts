import { PurchaseService } from './purchase.service';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let mockPhieuNhapRepo: any;
  let mockNhaCungCapRepo: any;
  let mockCtPhieuNhapRepo: any;
  let mockDataSource: any;
  let mockRabbitMQService: any;

  beforeEach(() => {
    mockPhieuNhapRepo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    };
    mockNhaCungCapRepo = {
      find: jest.fn().mockResolvedValue([{ maNCC: 'NCC01', tenNCC: 'Công ty Acecook' }]),
    };
    mockCtPhieuNhapRepo = {};
    mockDataSource = {
      query: jest.fn(),
    };
    mockRabbitMQService = {
      publish: jest.fn(),
    };

    service = new PurchaseService(
      mockPhieuNhapRepo,
      mockNhaCungCapRepo,
      mockCtPhieuNhapRepo,
      mockDataSource,
      mockRabbitMQService,
    );
  });

  it('should find suppliers successfully', async () => {
    const suppliers = await service.findAllSuppliers();
    expect(suppliers).toHaveLength(1);
    expect(suppliers[0].tenNCC).toBe('Công ty Acecook');
  });
});

