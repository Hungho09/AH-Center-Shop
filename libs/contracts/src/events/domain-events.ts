export interface EventEnvelope<T = any> {
  eventId: string;
  eventType: string;
  occurredOn: string;
  correlationId: string;
  causationId?: string;
  payload: T;
}

export interface IStockInRequestedPayload {
  idempotencyKey: string;
  maHang: string | number;
  soLuong: number;
  maPhieuNhap: string | number;
}

export interface IStockOutRequestedPayload {
  idempotencyKey: string;
  maHang: string | number;
  soLuong: number;
  sourceId: string | number;
  sourceType: 'HOADON' | 'PHIEUHUY';
}

export interface ISalePaymentRequestedPayload {
  idempotencyKey: string;
  maHoaDon: string | number;
  items: Array<{
    maHang: string | number;
    soLuong: number;
    donGia: number;
  }>;
}

export interface IPurchaseCompletedPayload {
  maPhieuNhap: string | number;
  items: Array<{
    maHang: string | number;
    soLuongNhap: number;
    giaNhap: number;
  }>;
}

export interface ISalePaidPayload {
  maHoaDon: string | number;
  maKhachHang?: string | number | null;
  tongTien: number;
  maNhanVien: string | number;
  diemSuDung?: number | null;
}

export interface IStockInCompletedPayload {
  maPhieuNhap: string | number;
  idempotencyKey: string;
}

export interface IStockOutCompletedPayload {
  sourceId: string | number;
  sourceType: 'HOADON' | 'PHIEUHUY';
  idempotencyKey: string;
}

export interface ICustomerPointsUpdatedPayload {
  maKhachHang: string | number;
  diemMoi: number;
  tongChiTieu: number;
}

export interface ILoyaltyTierUpgradedPayload {
  maKhachHang: string | number;
  hangCu: string;
  hangMoi: string;
}

export interface IInventoryLossCreatedPayload {
  maPhieuHuy: string | number;
  maHang: string | number;
  soLuongHuy: number;
  maNhanVien: string | number;
}

