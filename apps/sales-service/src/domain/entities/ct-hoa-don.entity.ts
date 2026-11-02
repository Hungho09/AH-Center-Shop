import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { HoaDonEntity } from './hoa-don.entity';

@Entity({ name: 'CT_HOADON' })
export class CtHoaDonEntity {
  @PrimaryColumn({ name: 'MaHoaDon', type: 'nvarchar', length: 50 })
  maHoaDon!: string;

  // Composite PK & Cross-domain FK reference to HANGHOA (Product domain)
  @PrimaryColumn({ name: 'MaHang', type: 'nvarchar', length: 50 })
  maHang!: string;

  @Column({ name: 'SoLuong', type: 'int' })
  soLuong!: number;

  @Column({ name: 'DonGia', type: 'decimal', precision: 18, scale: 2 })
  donGia!: number;

  @Column({ name: 'ThanhTien', type: 'decimal', precision: 18, scale: 2 })
  thanhTien!: number;

  @ManyToOne(() => HoaDonEntity, h => h.chiTiet)
  @JoinColumn({ name: 'MaHoaDon' })
  hoaDon?: HoaDonEntity;
}
