import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CtHoaDonEntity } from './ct-hoa-don.entity';

@Entity({ name: 'HOADON' })
export class HoaDonEntity {
  @PrimaryColumn({ name: 'MaHoaDon', type: 'nvarchar', length: 50 })
  maHoaDon!: string;

  // Cross-domain reference to KHACHHANG (Customer domain, nullable for retail walk-ins)
  @Column({ name: 'MaKhachHang', type: 'nvarchar', length: 50, nullable: true })
  maKhachHang?: string | null;

  // Cross-domain reference to NHANVIEN (HR domain)
  @Column({ name: 'MaNhanVien', type: 'nvarchar', length: 50 })
  maNhanVien!: string;

  @Column({ name: 'NgayLap', type: 'datetime' })
  ngayLap!: Date;

  @Column({ name: 'TrangThai', type: 'nvarchar', length: 50 })
  trangThai!: string;

  @Column({ name: 'TongTien', type: 'decimal', precision: 18, scale: 2 })
  tongTien!: number;

  @Column({ name: 'DiemSuDung', type: 'int', nullable: true })
  diemSuDung?: number | null;

  @OneToMany(() => CtHoaDonEntity, ct => ct.hoaDon)
  chiTiet?: CtHoaDonEntity[];
}
