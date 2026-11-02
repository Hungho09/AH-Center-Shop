# DEVELOPMENT_GUIDE.md

## Hướng Dẫn Phát Triển Dự Án — QL_CuaHangTienLoi

---

## 1. Khởi Động Dự Án (Getting Started)

### Bước 1: Sao chép biến môi trường

```bash
cp .env.example .env
```

### Bước 2: Khởi động các hạ tầng cơ sở dữ liệu và message broker

```bash
docker compose up -d sqlserver redis rabbitmq
```

### Bước 3: Khởi chạy môi trường phát triển Monorepo

Chạy đồng thời tất cả các microservices và web frontend:

```bash
npm run dev
```

Hoặc chỉ chạy từng thành phần cụ thể:

- API Gateway: `npm run dev:gateway`
- Identity Service: `npm run dev:identity`
- Product Inventory Service: `npm run dev:product`
- Purchase Service: `npm run dev:purchase`
- Sales Service: `npm run dev:sales`
- Customer Loyalty Service: `npm run dev:customer`
- HR Service: `npm run dev:hr`
- Inventory Loss Service: `npm run dev:loss`
- Web Frontend: `npm run dev:web`

---

## 2. Truy Cập Ứng Dụng

- **Frontend Web UI**: `http://localhost:5173`
  - Đăng nhập kiểm thử: `admin` / `Admin@123456` hoặc `cashier` / `Cashier@123456`
- **API Gateway**: `http://localhost:3000/api`
  - Health check: `http://localhost:3000/api/health`
- **RabbitMQ Dashboard**: `http://localhost:15672` (guest / guest)
- **SQL Server**: `localhost:1433` (sa / YourStrong@Password123)

---

## 3. Quy Chuẩn Code & Kiến Trúc

### 3.1 Ranh giới Domain (Clean Boundaries)

- Mỗi microservice trong `apps/` chỉ sở hữu các Entity và bảng thuộc thẩm quyền của mình.
- Tuyệt đối không import chéo Entity giữa các service.
- Giao tiếp bất đồng bộ qua RabbitMQ sử dụng payload envelope được định nghĩa tại `@ql/contracts`.

### 3.2 Correlation ID & Logging

- Mọi request khi đi qua API Gateway đều được gắn header `x-correlation-id`.
- Header này được tự động chuyển tiếp tới downstream microservices qua HTTP header và RabbitMQ envelope, giúp truy vết lỗi end-to-end.

### 3.3 An Toàn Database (Rule 5)

- Không bao giờ bật `synchronize: true` trong TypeORM.
- Không tự ý thực hiện migration làm thay đổi bảng, cột, kiểu dữ liệu, khóa chính/khóa ngoại của SQL Server hiện hữu.
