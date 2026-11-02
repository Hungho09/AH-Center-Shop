import { SystemRole } from '../constants/roles.constant';

export interface UserContext {
  sub: string;
  maNhanVien: string;
  tenNhanVien: string;
  role: SystemRole;
  maChucVu: string | number;
}

