import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CHUCVU' })
export class ChucVuEntity {
  @PrimaryColumn({ name: 'MaChucVu', type: 'nvarchar', length: 50 })
  maChucVu!: string;

  @Column({ name: 'TenChucVu', type: 'nvarchar', length: 100 })
  tenChucVu!: string;

  @Column({ name: 'MucLuongCoBan', type: 'decimal', precision: 18, scale: 2 })
  mucLuongCoBan!: number;
}

