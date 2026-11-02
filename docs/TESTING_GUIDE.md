# TESTING_GUIDE.md

## Chiến Lược Kiểm Thử Nền Móng Hệ Thống — QL_CuaHangTienLoi

---

## 1. Tổng Quan Chiến Lược Kiểm Thử

Để đảm bảo toàn bộ nền móng monorepo, backend microservices, shared libraries và frontend hoạt động ổn định trước khi triển khai nghiệp vụ, hệ thống thiết lập 4 cấp độ kiểm thử:

1. **Static Analysis & Type Safety**:
   - TypeScript compiler (`tsc --noEmit`) kiểm tra toàn diện kiểu dữ liệu và path aliases `@ql/*`.
   - ESLint & Prettier đảm bảo code style nhất quán.
2. **Unit Tests (Backend & Shared Libs)**:
   - Jest framework kiểm thử logic độc lập của services, controllers, guards, filters, hasing abstractions.
3. **Integration & Health Tests**:
   - Kiểm thử endpoint `/health` trên từng service.
   - Kiểm thử reverse proxy routing và error forwarding trên API Gateway.
4. **Infrastructure Verification**:
   - Kiểm tra tính hợp lệ của `docker-compose.yml`.
   - Kiểm tra khả năng kết nối SQL Server, Redis, RabbitMQ.

---

## 2. Các Lệnh Chạy Kiểm Thử

### 2.1 Kiểm tra kiểu toàn bộ Monorepo

```bash
npm run typecheck
```

### 2.2 Chạy toàn bộ Unit Tests

```bash
npm run test
```

### 2.3 Chạy Test với Coverage

```bash
npm run test:cov
```

### 2.4 Kiểm tra Code Style & Lint

```bash
npm run lint
npm run format:check
```

### 2.5 Kiểm tra Build toàn bộ ứng dụng

```bash
npm run build
```

---

## 3. Quy Tắc Kiểm Thử An Toàn (Rule 5 & Gated Execution)

- **Không gọi Stored Procedure ghi thật**:
  Trong giai đoạn scaffold, các Stored Procedure `usp_ThanhToanHoaDon` và `usp_HoanThanhPhieuNhap` được cấu hình dưới dạng **Gated Invocation**, chỉ kiểm tra tính kết nối database và logging execution plan mà không tự ý ghi/thay đổi dữ liệu trong DB thực tế.
- **Không tự động chạy migration hoặc synchronize schema**:
  Cấu hình `synchronize: false` và `migrationsRun: false` được bảo vệ nghiêm ngặt trên toàn bộ các service.
