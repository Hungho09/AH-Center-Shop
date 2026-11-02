import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { LoaiHangEntity } from './loai-hang.entity';

@Entity({ name: 'HANGHOA' })
export class HangHoaEntity {
  @PrimaryColumn({ name: 'MaHang', type: 'nvarchar', length: 50 })
  maHang!: string;

  @Column({ name: 'TenHang', type: 'nvarchar', length: 200 })
  tenHang!: string;

  @Column({ name: 'MaLoai', type: 'nvarchar', length: 50 })
  maLoai!: string;

  @ManyToOne(() => LoaiHangEntity)
  @JoinColumn({ name: 'MaLoai' })
  loaiHang?: LoaiHangEntity;

  @Column({ name: 'DonViTinh', type: 'nvarchar', length: 50 })
  donViTinh!: string;

  @Column({ name: 'GiaBan', type: 'decimal', precision: 18, scale: 2 })
  giaBan!: number;

  @Column({ name: 'GiaVon', type: 'decimal', precision: 18, scale: 2, nullable: true })
  giaVon?: number | null;

  @Column({ name: 'SoLuongTon', type: 'int' })
  soLuongTon!: number;
}

