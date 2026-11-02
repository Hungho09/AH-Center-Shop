# ARCHITECTURE_DECISIONS.md

## Nhật Ký Quyết Định Kiến Trúc (ADR Log) — QL_CuaHangTienLoi

---

## Danh Sách Quyết Định

### ADR-001: Lựa Chọn Mô Hình Kiến Trúc Hệ Thống

- **Trạng thái**: APPROVED (Triển khai giai đoạn 1)
- **Quyết định**: Triển khai kiến trúc Microservices-oriented logic với Shared Database (Phase 1) trên Monorepo.
- **Lý do**: Đảm bảo ranh giới domain rõ ràng cho 6 nghiệp vụ độc lập, giảm thiểu rủi ro distributed transaction giai đoạn đầu khi các Stored Procedure `usp_ThanhToanHoaDon` và `usp_HoanThanhPhieuNhap` cần thực thi nguyên tử (atomic).

---

### ADR-002: Lựa Chọn Công Cụ Quản Lý Monorepo

- **Trạng thái**: APPROVED
- **Quyết định**: Sử dụng Turborepo kết hợp npm workspaces.
- **Lý do**:
  1. Hỗ trợ xuất sắc cả NestJS backend và React + Vite frontend.
  2. Tối ưu build caching và dependency graph pipeline.
  3. Nhẹ, tương thích hoàn toàn với Node.js v20-v25+ và npm 11.
  4. Tuân thủ Global Rule: Không tạo đồng thời Nx và Turborepo.

---

### ADR-003: Chiến Lược Bảng Tài Khoản Đăng Nhập (TAIKHOAN)

- **Trạng thái**: PENDING APPROVAL
- **Vấn đề**: Database hiện hữu của dự án không có bảng lưu trữ tài khoản đăng nhập và mật khẩu, cũng như không liên kết trực tiếp `NHANVIEN` với tài khoản hệ thống.
- **Biện pháp tạm thời (Scaffold)**:
  1. Không tự ý tạo bảng mới hoặc sửa đổi database theo Rule 1 và Rule 5.
  2. Xây dựng nền tảng Identity Service với JWT Strategy, Password Hashing abstraction, Guards và tài khoản kiểm thử in-memory (`admin`, `cashier`).
  3. Ghi nhận rõ trạng thái chờ phê duyệt chính thức từ các bên liên quan.

---

### ADR-004: Cơ Chế Đồng Bộ Trừ/Cộng Tồn Kho & Stored Procedures

- **Trạng thái**: APPROVED
- **Quyết định**: Áp dụng mô hình **Designated Caller Pattern**:
  - Chỉ duy nhất `sales-service` được phép gọi `usp_ThanhToanHoaDon`.
  - Chỉ duy nhất `purchase-service` được phép gọi `usp_HoanThanhPhieuNhap`.
  - Cột `SoLuongTon` trong `HANGHOA` thuộc quyền sở hữu của `product-inventory-service`.
  - Trong giai đoạn Scaffold (Stage 2-6), các SP được cấu hình kiểm tra kết nối an toàn (Gated Execution) và không ghi dữ liệu giả.

---

### ADR-005: Chiến Lược Quản Lý Lỗi & Correlation ID

- **Trạng thái**: APPROVED
- **Quyết định**: Mọi request qua API Gateway đều được cấp phát `x-correlation-id` duy nhất và lan truyền qua HTTP headers cũng như message envelope RabbitMQ. Mọi exception đều được định dạng theo cấu trúc `ApiResponse<T>`.
