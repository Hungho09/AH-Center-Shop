import { HrService } from './hr.service';

describe('HrService', () => {
  let service: HrService;
  let mockNhanVienRepo: any;
  let mockChucVuRepo: any;
  let mockCaLamViecRepo: any;
  let mockPhanCaRepo: any;
  let mockDataSource: any;

  beforeEach(() => {
    mockNhanVienRepo = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };
    mockChucVuRepo = {
      find: jest.fn().mockResolvedValue([{ maChucVu: 'CV01', tenChucVu: 'Quản lý cửa hàng' }]),
    };
    mockCaLamViecRepo = {
      find: jest.fn().mockResolvedValue([{ maCa: 'CA01', tenCa: 'Ca sáng' }]),
    };
    mockPhanCaRepo = {};
    mockDataSource = {
      isInitialized: true,
      query: jest.fn().mockResolvedValue([]),
    };

    service = new HrService(
      mockNhanVienRepo,
      mockChucVuRepo,
      mockCaLamViecRepo,
      mockPhanCaRepo,
      mockDataSource,
    );
  });

  it('should find all roles successfully', async () => {
    const roles = await service.findAllRoles();
    expect(roles).toHaveLength(1);
    expect(roles[0].tenChucVu).toBe('Quản lý cửa hàng');
  });

  it('should find all shifts successfully', async () => {
    const shifts = await service.findAllShifts();
    expect(shifts).toHaveLength(1);
    expect(shifts[0].tenCa).toBe('Ca sáng');
  });
});

