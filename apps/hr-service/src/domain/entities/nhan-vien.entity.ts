import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChucVuEntity } from './chuc-vu.entity';

@Entity({ name: 'NHANVIEN' })
export class NhanVienEntity {
  @PrimaryColumn({ name: 'MaNhanVien', type: 'nvarchar', length: 50 })
  maNhanVien!: string;

  @Column({ name: 'TenNhanVien', type: 'nvarchar', length: 200 })
  tenNhanVien!: string;

  @Column({ name: 'MaChucVu', type: 'nvarchar', length: 50 })
  maChucVu!: string;

  @ManyToOne(() => ChucVuEntity)
  @JoinColumn({ name: 'MaChucVu' })
  chucVu?: ChucVuEntity;

  @Column({ name: 'NgaySinh', type: 'date' })
  ngaySinh!: Date;

  @Column({ name: 'SoDienThoai', type: 'nvarchar', length: 20 })
  soDienThoai!: string;

  @Column({ name: 'DiaChi', type: 'nvarchar', length: 500, nullable: true })
  diaChi?: string | null;

  @Column({ name: 'GioiTinh', type: 'nvarchar', length: 10 })
  gioiTinh!: string;
}

