# EVENT_CATALOG.md

## Danh Mục Sự Kiện & Lệnh Bất Đồng Bộ (RabbitMQ) — QL_CuaHangTienLoi

---

## 1. Cấu Trúc Message Chuẩn (Envelope)

Mọi message gửi qua RabbitMQ đều được bao bọc trong cấu trúc `EventEnvelope<T>`:

```typescript
export interface EventEnvelope<T = any> {
  eventId: string;
  eventType: string;
  occurredOn: string;
  correlationId: string;
  causationId?: string;
  payload: T;
}
```

Exchange mặc định: `ql.events` (Topic)
Dead Letter Exchange: `ql.events.dlx`

---

## 2. Danh Mục Commands & Events

| Type        | Routing Key                      | Publisher                             | Consumer(s)                           | Payload tóm tắt                                             |
| ----------- | -------------------------------- | ------------------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| **Command** | `command.stock.in.requested`     | purchase-service                      | product-inventory-service             | `{ idempotencyKey, maHang, soLuong, maPhieuNhap }`          |
| **Command** | `command.stock.out.requested`    | sales-service, inventory-loss-service | product-inventory-service             | `{ idempotencyKey, maHang, soLuong, sourceId, sourceType }` |
| **Command** | `command.sale.payment.requested` | sales-service                         | product-inventory-service             | `{ idempotencyKey, maHoaDon, items: [...] }`                |
| **Event**   | `event.purchase.completed`       | purchase-service                      | product-inventory-service             | `{ maPhieuNhap, items: [...] }`                             |
| **Event**   | `event.sale.paid`                | sales-service                         | customer-loyalty-service, hr-service  | `{ maHoaDon, maKhachHang, tongTien, maNhanVien }`           |
| **Event**   | `event.stock.in.completed`       | product-inventory-service             | purchase-service                      | `{ maPhieuNhap, idempotencyKey }`                           |
| **Event**   | `event.stock.out.completed`      | product-inventory-service             | sales-service, inventory-loss-service | `{ sourceId, sourceType, idempotencyKey }`                  |
| **Event**   | `event.customer.points.updated`  | customer-loyalty-service              | —                                     | `{ maKhachHang, diemMoi, tongChiTieu }`                     |
| **Event**   | `event.loyalty.tier.upgraded`    | customer-loyalty-service              | —                                     | `{ maKhachHang, hangCu, hangMoi }`                          |
| **Event**   | `event.inventory.loss.created`   | inventory-loss-service                | product-inventory-service             | `{ maPhieuHuy, maHang, soLuongHuy, maNhanVien }`            |
