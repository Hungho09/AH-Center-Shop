# MICROSERVICES_DESIGN.md

## Thiết Kế Chi Tiết Microservices — QL_CuaHangTienLoi

---

## 1. Danh Sách 8 Microservices Trong Hệ Thống

| Microservice                  | Port | Trách nhiệm chính                                                                     | Database Ownership (Write)                  | Cross-domain Read                                                  |
| ----------------------------- | ---- | ------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| **api-gateway**               | 3000 | Reverse Proxy, Centralized Auth Verification, Rate Limiting, Correlation ID Injection | Không sở hữu                                | Downstream microservices                                           |
| **identity-service**          | 3001 | JWT issuance, password hashing abstraction, RBAC foundation                           | TAIKHOAN (ADR-003 Pending Approval)         | NHANVIEN (tham chiếu MaChucVu)                                     |
| **product-inventory-service** | 3002 | Quản lý danh mục hàng hoá và tồn kho (`SoLuongTon`)                                   | `LOAIHANG`, `HANGHOA`                       | —                                                                  |
| **purchase-service**          | 3003 | Quản lý nhà cung cấp và phiếu nhập hàng                                               | `NHACUNGCAP`, `PHIEUNHAP`, `CT_PHIEUNHAP`   | `HANGHOA` (read stock), `NHANVIEN` (staff ref)                     |
| **sales-service**             | 3004 | Quản lý hoá đơn bán hàng, xử lý thanh toán                                            | `HOADON`, `CT_HOADON`                       | `HANGHOA` (read stock), `KHACHHANG` (read), `NHANVIEN` (staff ref) |
| **customer-loyalty-service**  | 3005 | Quản lý khách hàng, tích luỹ điểm, hạng thành viên                                    | `KHACHHANG`, `HANGTHANHVIEN`                | —                                                                  |
| **hr-service**                | 3006 | Quản lý nhân viên, chức vụ, ca làm việc, phân ca, báo cáo lương/doanh số              | `CHUCVU`, `NHANVIEN`, `CALAMVIEC`, `PHANCA` | `HOADON` (read for salary report)                                  |
| **inventory-loss-service**    | 3007 | Quản lý phiếu hủy hàng do hỏng/hết hạn                                                | `PHIEUHUY`                                  | `HANGHOA` (read stock), `NHANVIEN` (staff ref)                     |

---

## 2. Giao Tiếp Giữa Các Dịch Vụ (Inter-Service Communication)

### 2.1 Đồng bộ (Synchronous REST via API Gateway)

- Khách hàng và Frontend gọi duy nhất cổng `http://localhost:3000/api/...`.
- Gateway kiểm tra JWT signature qua `JwtAuthGuard` và quyền hạn qua `RolesGuard`.
- Request được gắn `x-correlation-id` và `x-request-id` chuyển tiếp tới service đích.
- Service đích trả kết quả hoặc error response chuẩn theo hợp đồng `ApiResponse<T>`.

### 2.2 Bất đồng bộ (Asynchronous Event-Driven via RabbitMQ)

- Exchange chính: `ql.events` (Topic Exchange).
- Dead Letter Exchange: `ql.events.dlx`.
- Khi nghiệp vụ hoàn tất, publisher đưa message bọc trong `EventEnvelope<T>` vào exchange.
- Các service tiêu thụ (consumers) lắng nghe queue riêng biệt và xử lý idempotently:
  - `ql.product-inventory.queue`
  - `ql.purchase.queue`
  - `ql.sales.queue`
  - `ql.customer-loyalty.queue`
  - `ql.hr.queue`
  - `ql.inventory-loss.queue`

---

## 3. Ranh Giới Database Trong Giai Đoạn 1 (Shared DB Pattern)

1. Mọi service cùng kết nối tới database `QL_CuaHangTienLoi` trên SQL Server.
2. Tuy nhiên, quyền ghi (write ownership) được cô lập nghiêm ngặt theo domain:
   - Chỉ `product-inventory-service` được ghi `HANGHOA`, `LOAIHANG`.
   - Chỉ `purchase-service` được ghi `PHIEUNHAP`, `CT_PHIEUNHAP`, `NHACUNGCAP` và gọi `usp_HoanThanhPhieuNhap`.
   - Chỉ `sales-service` được ghi `HOADON`, `CT_HOADON` và gọi `usp_ThanhToanHoaDon`.
   - Chỉ `customer-loyalty-service` được ghi `KHACHHANG`, `HANGTHANHVIEN`.
   - Chỉ `hr-service` được ghi `CHUCVU`, `NHANVIEN`, `CALAMVIEC`, `PHANCA`.
   - Chỉ `inventory-loss-service` được ghi `PHIEUHUY`.
3. Tất cả TypeORM connections đều tắt `synchronize` và `migrationsRun`.
