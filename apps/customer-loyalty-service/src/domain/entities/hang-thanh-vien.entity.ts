import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'HANGTHANHVIEN' })
export class HangThanhVienEntity {
  @PrimaryColumn({ name: 'MaHang', type: 'nvarchar', length: 20 })
  maHang!: string;

  @Column({ name: 'TenHang', type: 'nvarchar', length: 50 })
  tenHang!: string;

  @Column({ name: 'NguongChiTieu', type: 'decimal', precision: 18, scale: 2 })
  nguongChiTieu!: number;

  @Column({ name: 'HeSoTichDiem', type: 'decimal', precision: 5, scale: 2, nullable: true })
  heSoTichDiem?: number | null;
}

