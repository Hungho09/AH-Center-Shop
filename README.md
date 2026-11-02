# AH-Center-Shop — QL_CuaHangTienLoi

> Enterprise Convenience Store Management Platform built on a Microservices-oriented Monorepo architecture.

---

## 1. Quick Start

### 1.1 Khởi tạo môi trường

```bash
# 1. Cài đặt dependencies (đã thực hiện)
npm install

# 2. Cấu hình biến môi trường
cp .env.example .env

# 3. Khởi động hạ tầng cơ sở dữ liệu và message broker
docker compose up -d sqlserver redis rabbitmq

# 4. Chạy toàn bộ hệ thống phát triển
npm run dev
```

### 1.2 Truy cập nhanh

- **Frontend Web UI**: `http://localhost:5173` (Tài khoản kiểm thử: `admin` / `Admin@123456`)
- **API Gateway**: `http://localhost:3000/api`
- **RabbitMQ Dashboard**: `http://localhost:15672` (guest / guest)
- **SQL Server**: `localhost:1433` (sa / YourStrong@Password123)

---

## 2. Các Lệnh Thao Tác Chính

```bash
# Kiểm tra toàn bộ Type Safety
npm run typecheck

# Chạy toàn bộ Unit Tests
npm run test

# Build production toàn bộ ứng dụng
npm run build

# Kiểm tra linting
npm run lint

# Format code
npm run format
```

---

## 3. Cấu Trúc Tài Liệu Chi Tiết (`docs/`)

- [DATABASE_CONTEXT.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/DATABASE_CONTEXT.md) — Ngữ cảnh chi tiết 14 bảng, kiểu dữ liệu, ràng buộc và SP
- [SYSTEM_ARCHITECTURE.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/SYSTEM_ARCHITECTURE.md) — Kiến trúc tổng thể hệ thống
- [MICROSERVICES_DESIGN.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/MICROSERVICES_DESIGN.md) — Thiết kế 8 microservices và phân quyền
- [SERVICE_DATABASE_OWNERSHIP.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/SERVICE_DATABASE_OWNERSHIP.md) — Ma trận quyền sở hữu ghi/đọc bảng
- [API_CONTRACTS.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/API_CONTRACTS.md) — Hợp đồng REST API toàn diện
- [EVENT_CATALOG.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/EVENT_CATALOG.md) — Danh mục sự kiện và lệnh RabbitMQ
- [DEVELOPMENT_GUIDE.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/DEVELOPMENT_GUIDE.md) — Hướng dẫn phát triển và mở rộng code
- [ENVIRONMENT_SETUP.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/ENVIRONMENT_SETUP.md) — Cài đặt môi trường và cấu hình cổng
- [DOCKER_GUIDE.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/DOCKER_GUIDE.md) — Điều phối container và quản lý volumes
- [TESTING_GUIDE.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/TESTING_GUIDE.md) — Chiến lược kiểm thử tự động
- [ARCHITECTURE_DECISIONS.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/ARCHITECTURE_DECISIONS.md) — Nhật ký quyết định kiến trúc (ADR)
- [IMPLEMENTATION_STATUS.md](file:///Users/hohung/Downloads/Hồ%20Sỹ%20Mạnh%20HÙng/AH-Center-Shop/docs/IMPLEMENTATION_STATUS.md) — Bảng theo dõi tiến độ triển khai
