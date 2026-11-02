import { SalesService } from './sales.service';

describe('SalesService', () => {
  let service: SalesService;
  let mockHoaDonRepo: any;
  let mockCtHoaDonRepo: any;
  let mockDataSource: any;
  let mockRabbitMQService: any;

  beforeEach(() => {
    mockHoaDonRepo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    };
    mockCtHoaDonRepo = {};
    mockDataSource = {
      query: jest.fn(),
    };
    mockRabbitMQService = {
      publish: jest.fn(),
    };

    service = new SalesService(
      mockHoaDonRepo,
      mockCtHoaDonRepo,
      mockDataSource,
      mockRabbitMQService,
    );
  });

  it('should find invoice by id or throw if not found', async () => {
    mockHoaDonRepo.findOne.mockResolvedValue(null);
    await expect(service.findInvoiceById('HD999')).rejects.toThrow();
  });
});

