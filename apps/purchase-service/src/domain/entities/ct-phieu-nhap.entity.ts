import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PhieuNhapEntity } from './phieu-nhap.entity';

@Entity({ name: 'CT_PHIEUNHAP' })
export class CtPhieuNhapEntity {
  @PrimaryColumn({ name: 'MaPhieuNhap', type: 'nvarchar', length: 50 })
  maPhieuNhap!: string;

  // Composite PK column & Cross-domain FK reference to HANGHOA (Product domain)
  @PrimaryColumn({ name: 'MaHang', type: 'nvarchar', length: 50 })
  maHang!: string;

  @Column({ name: 'SoLuongNhap', type: 'int' })
  soLuongNhap!: number;

  @Column({ name: 'GiaNhap', type: 'decimal', precision: 18, scale: 2 })
  giaNhap!: number;

  @ManyToOne(() => PhieuNhapEntity, p => p.chiTiet)
  @JoinColumn({ name: 'MaPhieuNhap' })
  phieuNhap?: PhieuNhapEntity;
}
