import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { NhaCungCapEntity } from './nha-cung-cap.entity';
import { CtPhieuNhapEntity } from './ct-phieu-nhap.entity';

@Entity({ name: 'PHIEUNHAP' })
export class PhieuNhapEntity {
  @PrimaryColumn({ name: 'MaPhieuNhap', type: 'nvarchar', length: 50 })
  maPhieuNhap!: string;

  @Column({ name: 'MaNCC', type: 'nvarchar', length: 50 })
  maNCC!: string;

  @ManyToOne(() => NhaCungCapEntity)
  @JoinColumn({ name: 'MaNCC' })
  nhaCungCap?: NhaCungCapEntity;

  // Cross-domain reference to NHANVIEN (HR domain)
  @Column({ name: 'MaNhanVien', type: 'nvarchar', length: 50 })
  maNhanVien!: string;

  @Column({ name: 'NgayNhap', type: 'datetime' })
  ngayNhap!: Date;

  @Column({ name: 'TrangThai', type: 'nvarchar', length: 50 })
  trangThai!: string;

  @Column({ name: 'GhiChu', type: 'nvarchar', length: 500, nullable: true })
  ghiChu?: string | null;

  @OneToMany(() => CtPhieuNhapEntity, ct => ct.phieuNhap)
  chiTiet?: CtPhieuNhapEntity[];
}
