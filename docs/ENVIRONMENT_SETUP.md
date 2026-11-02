# ENVIRONMENT_SETUP.md

## Hướng Dẫn Cài Đặt Môi Trường — QL_CuaHangTienLoi

---

## 1. Yêu Cầu Phần Mềm Môi Trường (System Prerequisites)

| Công cụ                  | Phiên bản khuyến nghị                   | Ghi chú                                        |
| ------------------------ | --------------------------------------- | ---------------------------------------------- |
| **Node.js**              | `>= 20.x` (Đã kiểm thử trên `v25.8.1`)  | Runtime chính cho Backend & Frontend tooling   |
| **npm**                  | `>= 10.x` (Đã kiểm thử trên `v11.11.0`) | Package manager hỗ trợ npm workspaces          |
| **Docker Engine**        | `>= 24.x` (Đã kiểm thử trên `v28.4.0`)  | Containerization                               |
| **Docker Compose**       | `>= 2.20.x`                             | Điều phối hạ tầng                              |
| **Microsoft SQL Server** | 2019 hoặc 2022                          | RDBMS lưu trữ dữ liệu (Port 1433)              |
| **Redis**                | `7.x-alpine`                            | Cache, Distributed Lock, Session (Port 6379)   |
| **RabbitMQ**             | `3.x-management-alpine`                 | Message Broker & Event Bus (Port 5672 / 15672) |

---

## 2. Bảng Phân Bổ Cổng Mạng (Port Allocation Matrix)

| Thành phần                    | Port Host | Giao thức | Mục đích                                                        |
| ----------------------------- | --------- | --------- | --------------------------------------------------------------- |
| **api-gateway**               | `3000`    | HTTP      | Điểm truy cập API duy nhất cho Client                           |
| **identity-service**          | `3001`    | HTTP      | Nền tảng Authentication / JWT (ADR-003)                         |
| **product-inventory-service** | `3002`    | HTTP      | Quản lý sản phẩm, danh mục, tồn kho                             |
| **purchase-service**          | `3003`    | HTTP      | Quản lý nhập hàng, nhà cung cấp                                 |
| **sales-service**             | `3004`    | HTTP      | Quản lý bán hàng, hoá đơn, thanh toán                           |
| **customer-loyalty-service**  | `3005`    | HTTP      | Quản lý khách hàng, tích điểm, hạng                             |
| **hr-service**                | `3006`    | HTTP      | Quản lý nhân viên, ca làm việc, phân ca, báo cáo lương/doanh số |
| **inventory-loss-service**    | `3007`    | HTTP      | Quản lý phiếu hủy hàng, thất thoát kho                          |
| **Frontend Web (Vite Dev)**   | `5173`    | HTTP      | Giao diện React SPA trong môi trường phát triển                 |
| **Frontend Web (Docker)**     | `3100`    | HTTP      | Giao diện chạy qua Nginx container                              |
| **SQL Server**                | `1433`    | TCP       | Cổng kết nối cơ sở dữ liệu `QL_CuaHangTienLoi`                  |
| **Redis**                     | `6379`    | TCP       | Cổng kết nối Cache / Key-Value store                            |
| **RabbitMQ AMQP**             | `5672`    | TCP       | Cổng truyền nhận Message / Event Bus                            |
| **RabbitMQ Management**       | `15672`   | HTTP      | Giao diện quản trị Web UI của RabbitMQ                          |

---

## 3. Biến Môi Trường (Environment Variables)

File mẫu: `.env.example`

Để khởi tạo môi trường dev:

```bash
cp .env.example .env
```

### Các nhóm biến quan trọng:

1. **Database:**
   - `DB_HOST`: `localhost` khi chạy dev trực tiếp trên máy host; `sqlserver` khi chạy trong Docker.
   - `DB_PORT`: `1433`
   - `DB_USERNAME`: `sa`
   - `DB_PASSWORD`: Mật khẩu quản trị SQL Server.
   - `DB_NAME`: `QL_CuaHangTienLoi`
   - `DB_SYNCHRONIZE`: Luôn là `false` theo quy tắc Rule 5.
2. **Message Broker:**
   - `RABBITMQ_URL`: `amqp://guest:guest@localhost:5672` (hoặc `amqp://guest:guest@rabbitmq:5672` trong container).
   - `RABBITMQ_EXCHANGE`: `ql.events`
3. **Security:**
   - `JWT_SECRET`: Khóa ký HMAC bí mật. Thay đổi khi lên production.
