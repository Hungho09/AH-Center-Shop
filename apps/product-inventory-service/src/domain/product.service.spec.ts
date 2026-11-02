import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let mockHangHoaRepo: any;
  let mockLoaiHangRepo: any;
  let mockRabbitMQService: any;

  beforeEach(() => {
    mockHangHoaRepo = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };
    mockLoaiHangRepo = {
      find: jest.fn().mockResolvedValue([{ maLoai: 'L01', tenLoai: 'Bánh kẹo' }]),
    };
    mockRabbitMQService = {
      subscribe: jest.fn(),
    };

    service = new ProductService(mockHangHoaRepo, mockLoaiHangRepo, mockRabbitMQService);
  });

  it('should find categories successfully', async () => {
    const categories = await service.findAllCategories();
    expect(categories).toHaveLength(1);
    expect(categories[0].tenLoai).toBe('Bánh kẹo');
  });
});

