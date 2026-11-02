import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { HangThanhVienEntity } from './hang-thanh-vien.entity';

@Entity({ name: 'KHACHHANG' })
export class KhachHangEntity {
  @PrimaryColumn({ name: 'MaKhachHang', type: 'nvarchar', length: 50 })
  maKhachHang!: string;

  @Column({ name: 'TenKhachHang', type: 'nvarchar', length: 200 })
  tenKhachHang!: string;

  @Column({ name: 'SoDienThoai', type: 'nvarchar', length: 20, unique: true })
  soDienThoai!: string;

  @Column({ name: 'DiaChi', type: 'nvarchar', length: 500, nullable: true })
  diaChi?: string | null;

  @Column({ name: 'DiemTichLuy', type: 'int', default: 0 })
  diemTichLuy!: number;

  @Column({ name: 'TongChiTieu', type: 'decimal', precision: 18, scale: 2, default: 0 })
  tongChiTieu!: number;

  @Column({ name: 'MaHang', type: 'nvarchar', length: 20 })
  maHang!: string;

  @ManyToOne(() => HangThanhVienEntity)
  @JoinColumn({ name: 'MaHang' })
  hangThanhVien?: HangThanhVienEntity;
}

