import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NhanVienEntity } from './entities/nhan-vien.entity';
import { ChucVuEntity } from './entities/chuc-vu.entity';
import { CaLamViecEntity } from './entities/ca-lam-viec.entity';
import { PhanCaEntity } from './entities/phan-ca.entity';

@Injectable()
export class HrService {
  private readonly logger = new Logger(HrService.name);

  constructor(
    @InjectRepository(NhanVienEntity)
    private readonly nhanVienRepo: Repository<NhanVienEntity>,
    @InjectRepository(ChucVuEntity)
    private readonly chucVuRepo: Repository<ChucVuEntity>,
    @InjectRepository(CaLamViecEntity)
    private readonly caLamViecRepo: Repository<CaLamViecEntity>,
    @InjectRepository(PhanCaEntity)
    private readonly phanCaRepo: Repository<PhanCaEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAllEmployees(page = 1, limit = 20, search?: string) {
    const query = this.nhanVienRepo
      .createQueryBuilder('nv')
      .leftJoinAndSelect('nv.chucVu', 'chucVu');

    if (search) {
      query.where('nv.TenNhanVien LIKE :search OR nv.MaNhanVien LIKE :search', {
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

  async findEmployeeById(id: string) {
    const item = await this.nhanVienRepo.findOne({
      where: { maNhanVien: id },
      relations: ['chucVu'],
    });
    if (!item) {
      throw new NotFoundException(`Nhân viên với mã '${id}' không tồn tại`);
    }
    return item;
  }

  async findAllRoles() {
    return this.chucVuRepo.find();
  }

  async findAllShifts() {
    return this.caLamViecRepo.find();
  }

  async findAllShiftAssignments(page = 1, limit = 20) {
    const [items, total] = await this.phanCaRepo.findAndCount({
      relations: ['nhanVien', 'caLamViec'],
      skip: (page - 1) * limit,
      take: limit,
      order: { ngayLamViec: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Safe view reader for vw_BaoCaoLuongVaDoanhSoNV
   */
  async getSalaryAndSalesReport() {
    try {
      if (!this.dataSource.isInitialized) {
        return [];
      }
      return await this.dataSource.query('SELECT * FROM vw_BaoCaoLuongVaDoanhSoNV');
    } catch (err: any) {
      this.logger.warn(
        `Could not query vw_BaoCaoLuongVaDoanhSoNV (${err.message}). Returning empty scaffold.`,
      );
      return [];
    }
  }
}
