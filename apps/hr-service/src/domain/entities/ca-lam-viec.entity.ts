import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CALAMVIEC' })
export class CaLamViecEntity {
  @PrimaryColumn({ name: 'MaCa', type: 'nvarchar', length: 50 })
  maCa!: string;

  @Column({ name: 'TenCa', type: 'nvarchar', length: 50 })
  tenCa!: string;

  @Column({ name: 'GioBatDau', type: 'nvarchar', length: 20 })
  gioBatDau!: string;

  @Column({ name: 'GioKetThuc', type: 'nvarchar', length: 20 })
  gioKetThuc!: string;

  @Column({ name: 'LuongCa', type: 'decimal', precision: 18, scale: 2 })
  luongCa!: number;
}

