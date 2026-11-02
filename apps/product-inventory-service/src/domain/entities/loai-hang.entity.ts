import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'LOAIHANG' })
export class LoaiHangEntity {
  @PrimaryColumn({ name: 'MaLoai', type: 'nvarchar', length: 50 })
  maLoai!: string;

  @Column({ name: 'TenLoai', type: 'nvarchar', length: 100 })
  tenLoai!: string;

  @Column({ name: 'MoTa', type: 'nvarchar', length: 500, nullable: true })
  moTa?: string | null;
}

