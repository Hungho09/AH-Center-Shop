/**
 * Shared Domain Interfaces for QL_CuaHangTienLoi
 * Single Source of Truth for frontend components and backend services.
 */

// Product & Inventory Domain
export interface LoaiHang {
  maLoai: string;
  tenLoai: string;
}

export interface HangHoa {
  maHang: string;
  tenHang: string;
  maLoai: string;
  donViTinh: string;
  giaBan: number;
  giaVon?: number | null;
  soLuongTon: number;
  loaiHang?: LoaiHang;
}

// Sales Domain
export interface CtHoaDon {
  maHoaDon: string;
  maHang: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  hangHoa?: HangHoa;
}

export interface HoaDon {
  maHoaDon: string;
  maKhachHang?: string | null;
  maNhanVien: string;
  ngayLap: string | Date;
  trangThai: string;
  tongTien: number;
  diemSuDung?: number | null;
  chiTiet?: CtHoaDon[];
}

// Customer & Loyalty Domain
export interface HangThanhVien {
  maHang: string;
  tenHang: string;
  diemToiThieu: number;
  tyLeGiamGia: number;
}

export interface KhachHang {
  maKhachHang: string;
  tenKhachHang: string;
  soDienThoai: string;
  email?: string | null;
  diemTichLuy: number;
  maHangThanhVien?: string | null;
  hangThanhVien?: HangThanhVien;
}

// Purchase Domain
export interface NhaCungCap {
  maNhaCungCap: string;
  tenNhaCungCap: string;
  soDienThoai?: string | null;
  diaChi?: string | null;
  email?: string | null;
}

export interface CtPhieuNhap {
  maPhieuNhap: string;
  maHang: string;
  soLuong: number;
  donGiaNhap: number;
  thanhTien: number;
}

export interface PhieuNhap {
  maPhieuNhap: string;
  maNhaCungCap: string;
  maNhanVien: string;
  ngayNhap: string | Date;
  tongTien: number;
  trangThai: string;
  nhaCungCap?: NhaCungCap;
  chiTiet?: CtPhieuNhap[];
}

// HR & Shift Domain
export interface ChucVu {
  maChucVu: string | number;
  tenChucVu: string;
  heSoLuong?: number;
}

export interface NhanVien {
  maNhanVien: string;
  tenNhanVien: string;
  soDienThoai: string;
  email?: string | null;
  maChucVu: string | number;
  chucVu?: ChucVu;
  trangThai: string;
}

export interface CaLamViec {
  maCa: string;
  tenCa: string;
  gioBatDau: string;
  gioKetThuc: string;
  heSoLuong?: number;
}

export interface PhanCa {
  maPhanCa: string | number;
  maNhanVien: string;
  maCa: string;
  ngayLam: string | Date;
  trangThai: string;
  nhanVien?: NhanVien;
  caLamViec?: CaLamViec;
}

// Inventory Loss Domain
export interface PhieuHuy {
  maPhieuHuy: string;
  maHang: string;
  soLuong: number;
  lyDo: string;
  maNhanVien: string;
  ngayHuy: string | Date;
  trangThai: string;
}

