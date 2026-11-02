# API_CONTRACTS.md

## Hợp Đồng API Toàn Hệ Thống — QL_CuaHangTienLoi

---

## 1. Chuẩn Hóa Response & Error Format

Tất cả API trong hệ thống đều tuân thủ cấu trúc dữ liệu thống nhất `ApiResponse<T>`:

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
    timestamp: string;
    path?: string;
    correlationId?: string;
  };
}
```

---

## 2. Danh Sách Endpoint Theo Dịch Vụ

### 2.1 API Gateway / Health

- `GET /api/health` — Trạng thái sức khoẻ Gateway và tổng quan.

### 2.2 Identity Service (`:3001` qua Gateway)

- `POST /api/auth/login`
  - Body: `{ username: string, password: string }`
  - Response: `{ accessToken, refreshToken, tokenType, expiresIn, user }`
- `POST /api/auth/refresh`
  - Body: `{ refreshToken: string }`
  - Response: `{ accessToken, tokenType, expiresIn }`
- `GET /api/auth/profile` (Bearer Token)
  - Response: Thông tin người dùng hiện tại từ JWT.

### 2.3 Product & Inventory Service (`:3002` qua Gateway)

- `GET /api/products?page=1&limit=20&search=...` — Danh sách sản phẩm phân trang.
- `GET /api/products/:id` — Chi tiết sản phẩm.
- `GET /api/categories` — Danh sách danh mục hàng hoá.
- `GET /api/inventory/stock-check/:id` — Kiểm tra số lượng tồn kho tức thời.

### 2.4 Purchase Service (`:3003` qua Gateway)

- `GET /api/purchases?page=1&limit=20` — Danh sách phiếu nhập hàng.
- `GET /api/purchases/:id` — Chi tiết phiếu nhập hàng.
- `GET /api/suppliers` — Danh sách nhà cung cấp.
- `POST /api/purchases/:id/complete` — Hoàn thành phiếu nhập qua SP `usp_HoanThanhPhieuNhap` (gated invocation).

### 2.5 Sales Service (`:3004` qua Gateway)

- `GET /api/invoices?page=1&limit=20` — Danh sách hoá đơn bán hàng.
- `GET /api/invoices/:id` — Chi tiết hoá đơn bán hàng.
- `POST /api/invoices/:id/pay` — Xử lý thanh toán hoá đơn qua SP `usp_ThanhToanHoaDon` (gated invocation).

### 2.6 Customer & Loyalty Service (`:3005` qua Gateway)

- `GET /api/customers?page=1&limit=20&search=...` — Danh sách khách hàng.
- `GET /api/customers/:id` — Chi tiết khách hàng.
- `GET /api/customers/phone/:phone` — Tra cứu khách hàng theo số điện thoại.
- `GET /api/loyalty/tiers` — Danh sách hạng thành viên và ngưỡng chi tiêu.

### 2.7 HR Service (`:3006` qua Gateway)

- `GET /api/employees?page=1&limit=20&search=...` — Danh sách nhân viên.
- `GET /api/employees/:id` — Chi tiết nhân viên.
- `GET /api/shifts` — Danh mục các ca làm việc.
- `GET /api/shift-assignments?page=1&limit=20` — Danh sách phân ca làm việc.
- `GET /api/reports/salary-and-sales` — Báo cáo tổng hợp từ SQL View `vw_BaoCaoLuongVaDoanhSoNV`.

### 2.8 Inventory Loss Service (`:3007` qua Gateway)

- `GET /api/inventory-loss?page=1&limit=20` — Danh sách phiếu hủy hàng.
- `GET /api/inventory-loss/:id` — Chi tiết phiếu hủy hàng.
