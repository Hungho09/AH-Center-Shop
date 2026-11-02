import { InventoryLossService } from './inventory-loss.service';

describe('InventoryLossService', () => {
  let service: InventoryLossService;
  let mockPhieuHuyRepo: any;
  let mockRabbitMQService: any;

  beforeEach(() => {
    mockPhieuHuyRepo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    };
    mockRabbitMQService = {
      publish: jest.fn(),
    };

    service = new InventoryLossService(mockPhieuHuyRepo, mockRabbitMQService);
  });

  it('should find loss record by id or throw if not found', async () => {
    mockPhieuHuyRepo.findOne.mockResolvedValue(null);
    await expect(service.findLossRecordById('PH999')).rejects.toThrow();
  });
});

