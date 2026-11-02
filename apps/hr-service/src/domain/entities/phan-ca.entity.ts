import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { NhanVienEntity } from './nhan-vien.entity';
import { CaLamViecEntity } from './ca-lam-viec.entity';

@Entity({ name: 'PHANCA' })
export class PhanCaEntity {
  @PrimaryColumn({ name: 'MaPhieuPhanca', type: 'nvarchar', length: 50 })
  maPhieuPhanca!: string;

  @Column({ name: 'MaNhanVien', type: 'nvarchar', length: 50 })
  maNhanVien!: string;

  @ManyToOne(() => NhanVienEntity)
  @JoinColumn({ name: 'MaNhanVien' })
  nhanVien?: NhanVienEntity;

  @Column({ name: 'MaCa', type: 'nvarchar', length: 50 })
  maCa!: string;

  @ManyToOne(() => CaLamViecEntity)
  @JoinColumn({ name: 'MaCa' })
  caLamViec?: CaLamViecEntity;

  @Column({ name: 'NgayLamViec', type: 'date' })
  ngayLamViec!: Date;

  @Column({ name: 'TrangThai', type: 'nvarchar', length: 50 })
  trangThai!: string;
}

