# DOCKER_GUIDE.md

## Hướng Dẫn Vận Hành Hạ Tầng Docker — QL_CuaHangTienLoi

---

## 1. Cấu Trúc Hạ Tầng Docker Compose

Hệ thống cung cấp file `docker-compose.yml` điều phối toàn bộ dịch vụ và cơ sở hạ tầng trong mạng nội bộ `ql-network`:

```text
ql-network
├── Hạ tầng lõi
│   ├── sqlserver (Port 1433)
│   ├── redis (Port 6379)
│   └── rabbitmq (Port 5672, 15672)
│
├── Ứng dụng Backend
│   ├── api-gateway (Port 3000)
│   ├── identity-service (Port 3001)
│   ├── product-inventory-service (Port 3002)
│   ├── purchase-service (Port 3003)
│   ├── sales-service (Port 3004)
│   ├── customer-loyalty-service (Port 3005)
│   ├── hr-service (Port 3006)
│   └── inventory-loss-service (Port 3007)
│
└── Ứng dụng Frontend
    └── web (Port 3100 -> Container 80 với Nginx)
```

---

## 2. Hướng Dẫn Khởi Chạy

### 2.1 Khởi chạy riêng cơ sở hạ tầng (Khuyến nghị cho Development)

Nếu bạn muốn debug code trực tiếp trên máy host và chỉ cần SQL Server, Redis, RabbitMQ chạy nền:

```bash
docker compose up -d sqlserver redis rabbitmq
```

Kiểm tra trạng thái container hạ tầng:

```bash
docker compose ps
```

Truy cập RabbitMQ Management UI:

- URL: `http://localhost:15672`
- Tài khoản: `guest` / `guest`

### 2.2 Khởi chạy toàn bộ hệ thống (Full Stack)

```bash
docker compose up -d --build
```

Dừng toàn bộ hệ thống:

```bash
docker compose down
```

Dừng và xoá sạch volumes dữ liệu:

```bash
docker compose down -v
```

---

## 3. Quản Lý Dữ Liệu & Persistent Volumes

Dữ liệu được lưu trữ an toàn trong các Docker named volumes:

- `sqlserver_data`: Lưu trữ database files (`.mdf`, `.ldf`) của SQL Server.
- `redis_data`: Lưu trữ snapshot RDB của Redis.
- `rabbitmq_data`: Lưu trữ tin nhắn, exchange và metadata của RabbitMQ.

> [!CAUTION]
> Tuyệt đối không chạy `docker compose down -v` trên môi trường có dữ liệu kiểm thử quan trọng mà chưa thực hiện backup database.
