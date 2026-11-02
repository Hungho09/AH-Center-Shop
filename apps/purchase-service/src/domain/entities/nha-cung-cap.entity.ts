import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'NHACUNGCAP' })
export class NhaCungCapEntity {
  @PrimaryColumn({ name: 'MaNCC', type: 'nvarchar', length: 50 })
  maNCC!: string;

  @Column({ name: 'TenNCC', type: 'nvarchar', length: 200 })
  tenNCC!: string;

  @Column({ name: 'DiaChi', type: 'nvarchar', length: 500, nullable: true })
  diaChi?: string | null;

  @Column({ name: 'SoDienThoai', type: 'nvarchar', length: 20, nullable: true })
  soDienThoai?: string | null;

  @Column({ name: 'Email', type: 'nvarchar', length: 200, nullable: true })
  email?: string | null;
}

