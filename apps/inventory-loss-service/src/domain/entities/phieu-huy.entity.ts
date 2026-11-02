import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PHIEUHUY' })
export class PhieuHuyEntity {
  @PrimaryColumn({ name: 'MaPhieuHuy', type: 'nvarchar', length: 50 })
  maPhieuHuy!: string;

  // Cross-domain reference to HANGHOA (Product domain)
  @Column({ name: 'MaHang', type: 'nvarchar', length: 50 })
  maHang!: string;

  // Cross-domain reference to NHANVIEN (HR domain)
  @Column({ name: 'MaNhanVien', type: 'nvarchar', length: 50 })
  maNhanVien!: string;

  @Column({ name: 'SoLuongHuy', type: 'int' })
  soLuongHuy!: number;

  @Column({ name: 'LyDo', type: 'nvarchar', length: 500 })
  lyDo!: string;

  @Column({ name: 'NgayHuy', type: 'datetime' })
  ngayHuy!: Date;

  @Column({ name: 'GiaVon', type: 'decimal', precision: 18, scale: 2, nullable: true })
  giaVon?: number | null;

  @Column({ name: 'TrangThai', type: 'nvarchar', length: 50 })
  trangThai!: string;
}

