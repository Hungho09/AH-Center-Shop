# DATABASE_CONTEXT.md

## Ngữ Cảnh Cơ Sở Dữ Liệu — QL_CuaHangTienLoi

> **Evidence Classification Key:**
>
> - `[VERIFIED]` — Xác minh từ SQL script / source code thực tế
> - `[USER-PROVIDED]` — Được cung cấp trong tài liệu nghiệp vụ, chưa xác minh từ database
> - `[ASSUMPTION]` — Giả định phục vụ phân tích, cần xác minh
> - `[PROPOSAL]` — Đề xuất kiến trúc, cần phê duyệt

> [!IMPORTANT]
> Không có SQL script nào tồn tại trong workspace. **Mọi thông tin về cấu trúc database đều mang nhãn `[USER-PROVIDED]` hoặc `[ASSUMPTION]`**. Không được coi là sự thật tuyệt đối cho đến khi có SQL script xác nhận.

---

## 1. Tổng Quan Database

| Thuộc tính         | Giá trị                                             | Evidence        |
| ------------------ | --------------------------------------------------- | --------------- |
| Tên Database       | `QL_CuaHangTienLoi`                                 | [USER-PROVIDED] |
| DBMS               | Microsoft SQL Server                                | [USER-PROVIDED] |
| Default Schema     | `dbo`                                               | [USER-PROVIDED] |
| Số bảng            | 14                                                  | [USER-PROVIDED] |
| Views              | 1 (`vw_BaoCaoLuongVaDoanhSoNV`)                     | [USER-PROVIDED] |
| Stored Procedures  | 2 (`usp_ThanhToanHoaDon`, `usp_HoanThanhPhieuNhap`) | [USER-PROVIDED] |
| SQL Script hiện có | **KHÔNG CÓ**                                        | [VERIFIED]      |

---

## 2. Phân Domain và Danh Sách Bảng

| Domain                        | Bảng                                | Evidence        |
| ----------------------------- | ----------------------------------- | --------------- |
| Product Management            | LOAIHANG, HANGHOA                   | [USER-PROVIDED] |
| Purchase Management           | NHACUNGCAP, PHIEUNHAP, CT_PHIEUNHAP | [USER-PROVIDED] |
| Sales Management              | HOADON, CT_HOADON                   | [USER-PROVIDED] |
| Customer & Loyalty Management | KHACHHANG, HANGTHANHVIEN            | [USER-PROVIDED] |
| HR Management                 | CHUCVU, NHANVIEN, CALAMVIEC, PHANCA | [USER-PROVIDED] |
| Inventory Loss Management     | PHIEUHUY                            | [USER-PROVIDED] |

---

## 3. Phân Tích Chi Tiết Từng Bảng

### 3.1 LOAIHANG — Danh Mục Hàng Hoá

| Thuộc tính      | Chi tiết                                     | Evidence        |
| --------------- | -------------------------------------------- | --------------- |
| Domain          | Product Management                           | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Danh mục phân loại hàng hoá bán tại cửa hàng | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột     | Kiểu dữ liệu (giả định) | Constraint   | Ghi chú                            |
| ------- | ----------------------- | ------------ | ---------------------------------- |
| MaLoai  | INT / NVARCHAR          | PK, NOT NULL | Mã định danh danh mục              |
| TenLoai | NVARCHAR(100)           | NOT NULL     | Tên danh mục                       |
| MoTa    | NVARCHAR(500)           | NULL         | Mô tả danh mục (chưa chắc tồn tại) |

**Unknowns cần xác minh:**

- Kiểu PK: IDENTITY(1,1) hay NVARCHAR?
- Có cột MoTa hay không?
- Có cột TrangThai (ẩn/hiện danh mục) hay không?

---

### 3.2 HANGHOA — Hàng Hoá / Sản Phẩm

| Thuộc tính      | Chi tiết                                                  | Evidence        |
| --------------- | --------------------------------------------------------- | --------------- |
| Domain          | Product Management                                        | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Bảng trung tâm lưu thông tin sản phẩm và số lượng tồn kho | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột        | Kiểu dữ liệu (giả định) | Constraint              | Ghi chú                                        |
| ---------- | ----------------------- | ----------------------- | ---------------------------------------------- |
| MaHang     | INT / NVARCHAR          | PK, NOT NULL            | Mã hàng hoá                                    |
| TenHang    | NVARCHAR(200)           | NOT NULL                | Tên hàng hoá                                   |
| MaLoai     | INT / NVARCHAR          | FK → LOAIHANG, NOT NULL | Danh mục hàng                                  |
| DonViTinh  | NVARCHAR(50)            | NOT NULL                | Đơn vị tính (cái, kg, lít…)                    |
| GiaBan     | DECIMAL(18,2)           | NOT NULL, CHECK > 0     | Giá bán lẻ                                     |
| GiaVon     | DECIMAL(18,2)           | NULL                    | Giá vốn (sử dụng trong PHIEUHUY)               |
| SoLuongTon | INT                     | NOT NULL, CHECK >= 0    | Số lượng tồn kho — **điểm nóng ghi đồng thời** |

**Business Rules** `[USER-PROVIDED]`:

- `GiaBan` phải > 0
- `SoLuongTon` phải >= 0
- Cột `SoLuongTon` bị **3 luồng ghi**: `usp_ThanhToanHoaDon` (trừ), `usp_HoanThanhPhieuNhap` (cộng), và PHIEUHUY (trừ)

> [!CAUTION]
> **[RISK]** `SoLuongTon` là điểm nóng race condition: nhiều stored procedure và service đồng thời cập nhật cột này. Cần distributed locking hoặc pessimistic locking.

**Unknowns:**

- Cột `GiaVon` có trong bảng HANGHOA hay không?
- Có cột `HanSuDung`, `MoTa`, `HinhAnh` hay không?
- `SoLuongTon` có thể âm trong trường hợp nghiệp vụ nào không?

---

### 3.3 NHACUNGCAP — Nhà Cung Cấp

| Thuộc tính      | Chi tiết                                     | Evidence        |
| --------------- | -------------------------------------------- | --------------- |
| Domain          | Purchase Management                          | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Thông tin nhà cung cấp hàng hoá cho cửa hàng | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột         | Kiểu dữ liệu (giả định) | Constraint   | Ghi chú                           |
| ----------- | ----------------------- | ------------ | --------------------------------- |
| MaNCC       | INT / NVARCHAR          | PK, NOT NULL | Mã nhà cung cấp                   |
| TenNCC      | NVARCHAR(200)           | NOT NULL     | Tên nhà cung cấp                  |
| DiaChi      | NVARCHAR(500)           | NULL         | Địa chỉ                           |
| SoDienThoai | NVARCHAR(15)            | NULL         | Số điện thoại liên hệ             |
| Email       | NVARCHAR(200)           | NULL         | Email liên hệ (chưa chắc tồn tại) |

**Unknowns:**

- Có cột Email, Website không?
- Có cột TrangThai (hoạt động / ngừng hoạt động) không?

---

### 3.4 PHIEUNHAP — Phiếu Nhập Hàng

| Thuộc tính      | Chi tiết                                                         | Evidence        |
| --------------- | ---------------------------------------------------------------- | --------------- |
| Domain          | Purchase Management                                              | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Đầu phiếu nhập hàng, ghi nhận giao dịch nhập kho từ nhà cung cấp | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột         | Kiểu dữ liệu (giả định) | Constraint                | Ghi chú             |
| ----------- | ----------------------- | ------------------------- | ------------------- |
| MaPhieuNhap | INT / NVARCHAR          | PK, NOT NULL              | Mã phiếu nhập       |
| MaNCC       | INT / NVARCHAR          | FK → NHACUNGCAP, NOT NULL | Nhà cung cấp        |
| MaNhanVien  | INT / NVARCHAR          | FK → NHANVIEN, NOT NULL   | Nhân viên lập phiếu |
| NgayNhap    | DATETIME                | NOT NULL                  | Ngày nhập hàng      |
| TrangThai   | NVARCHAR(50)            | NOT NULL                  | Trạng thái phiếu    |
| GhiChu      | NVARCHAR(500)           | NULL                      | Ghi chú             |

**Business Rules** `[USER-PROVIDED]`:

- `TrangThai` phân biệt "chưa hoàn thành" vs "đã hoàn thành"
- `usp_HoanThanhPhieuNhap` chỉ xử lý phiếu **chưa hoàn thành**
- Idempotency: Chỉ xử lý một lần (không hoàn thành 2 lần)

**Cross-Domain FK** `[USER-PROVIDED]`: `MaNhanVien → NHANVIEN` (Purchase → HR domain)

**Unknowns:**

- Giá trị cụ thể của `TrangThai`: "Chưa hoàn thành" / "Đã hoàn thành" hay mã số (0/1)?
- Có TongTienNhap tổng hợp hay không?

---

### 3.5 CT_PHIEUNHAP — Chi Tiết Phiếu Nhập

| Thuộc tính      | Chi tiết                                 | Evidence        |
| --------------- | ---------------------------------------- | --------------- |
| Domain          | Purchase Management                      | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Chi tiết từng dòng hàng trong phiếu nhập | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột         | Kiểu dữ liệu (giả định) | Constraint               | Ghi chú                |
| ----------- | ----------------------- | ------------------------ | ---------------------- |
| MaPhieuNhap | INT / NVARCHAR          | FK → PHIEUNHAP, NOT NULL | Phiếu nhập             |
| MaHang      | INT / NVARCHAR          | FK → HANGHOA, NOT NULL   | Hàng hoá               |
| SoLuongNhap | INT                     | NOT NULL, CHECK > 0      | Số lượng nhập          |
| GiaNhap     | DECIMAL(18,2)           | NOT NULL, CHECK > 0      | Giá nhập tại thời điểm |

**Primary Key** `[ASSUMPTION]`: Composite PK `(MaPhieuNhap, MaHang)` — khả năng cao

**Cross-Domain FK** `[USER-PROVIDED]`: `MaHang → HANGHOA` (Purchase → Product domain)

**Unknowns:**

- Composite PK hay surrogate PK (MaCT_PhieuNhap)?
- Có cột ThanhTien tổng hợp hay tính runtime?

---

### 3.6 HOADON — Hoá Đơn Bán Hàng

| Thuộc tính      | Chi tiết                                 | Evidence        |
| --------------- | ---------------------------------------- | --------------- |
| Domain          | Sales Management                         | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Đầu hoá đơn giao dịch bán hàng cho khách | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột         | Kiểu dữ liệu (giả định) | Constraint               | Ghi chú                  |
| ----------- | ----------------------- | ------------------------ | ------------------------ |
| MaHoaDon    | INT / NVARCHAR          | PK, NOT NULL             | Mã hoá đơn               |
| MaKhachHang | INT / NVARCHAR          | FK → KHACHHANG, **NULL** | Null = khách mua lẻ      |
| MaNhanVien  | INT / NVARCHAR          | FK → NHANVIEN, NOT NULL  | Nhân viên lập hoá đơn    |
| NgayLap     | DATETIME                | NOT NULL                 | Ngày lập hoá đơn         |
| TrangThai   | NVARCHAR(50)            | NOT NULL                 | Trạng thái hoá đơn       |
| TongTien    | DECIMAL(18,2)           | NOT NULL                 | Tổng tiền cần thanh toán |
| DiemSuDung  | INT                     | NULL, CHECK >= 0         | Điểm sử dụng để giảm giá |

**Business Rules** `[USER-PROVIDED]`:

- `TrangThai`: "Mới tạo" → "Đã thanh toán" (chuyển trạng thái qua `usp_ThanhToanHoaDon`)
- Khách mua lẻ (`MaKhachHang IS NULL`) **không được** sử dụng điểm
- `DiemSuDung` chỉ áp dụng khi có `MaKhachHang`

**Cross-Domain FKs** `[USER-PROVIDED]`:

- `MaNhanVien → NHANVIEN` (Sales → HR domain)
- `MaKhachHang → KHACHHANG` (Sales → Customer domain, nullable)

**Unknowns:**

- Giá trị chính xác của `TrangThai`: "Mới tạo" / "Đã thanh toán" hay ENUM khác?
- Có cột `GiamGia` riêng ngoài `DiemSuDung` không?
- Công thức `TongTien` = SUM(CT_HOADON) - giảm giá điểm?

---

### 3.7 CT_HOADON — Chi Tiết Hoá Đơn

| Thuộc tính      | Chi tiết                                  | Evidence        |
| --------------- | ----------------------------------------- | --------------- |
| Domain          | Sales Management                          | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Chi tiết từng dòng hàng trong hoá đơn bán | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột       | Kiểu dữ liệu (giả định) | Constraint             | Ghi chú                   |
| --------- | ----------------------- | ---------------------- | ------------------------- |
| MaHoaDon  | INT / NVARCHAR          | FK → HOADON, NOT NULL  | Hoá đơn                   |
| MaHang    | INT / NVARCHAR          | FK → HANGHOA, NOT NULL | Hàng hoá                  |
| SoLuong   | INT                     | NOT NULL, CHECK > 0    | Số lượng bán              |
| DonGia    | DECIMAL(18,2)           | NOT NULL               | Đơn giá tại thời điểm bán |
| ThanhTien | DECIMAL(18,2)           | NOT NULL               | = SoLuong × DonGia        |

**Primary Key** `[ASSUMPTION]`: Composite PK `(MaHoaDon, MaHang)` — khả năng cao

**Cross-Domain FK** `[USER-PROVIDED]`: `MaHang → HANGHOA` (Sales → Product domain)

**Unknowns:**

- Composite PK hay surrogate PK?
- `DonGia` có thể khác `GiaBan` do khuyến mãi không?

---

### 3.8 KHACHHANG — Khách Hàng

| Thuộc tính      | Chi tiết                                                 | Evidence        |
| --------------- | -------------------------------------------------------- | --------------- |
| Domain          | Customer & Loyalty Management                            | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Thông tin khách hàng thành viên và dữ liệu tích lũy điểm | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột          | Kiểu dữ liệu (giả định) | Constraint                   | Ghi chú                 |
| ------------ | ----------------------- | ---------------------------- | ----------------------- |
| MaKhachHang  | INT / NVARCHAR          | PK, NOT NULL                 | Mã khách hàng           |
| TenKhachHang | NVARCHAR(200)           | NOT NULL                     | Tên khách hàng          |
| SoDienThoai  | NVARCHAR(15)            | UNIQUE, NOT NULL             | Số điện thoại định danh |
| DiaChi       | NVARCHAR(500)           | NULL                         | Địa chỉ                 |
| DiemTichLuy  | INT                     | NOT NULL, DEFAULT 0          | Điểm tích luỹ hiện tại  |
| TongChiTieu  | DECIMAL(18,2)           | NOT NULL, DEFAULT 0          | Tổng chi tiêu tích lũy  |
| MaHang       | INT / NVARCHAR          | FK → HANGTHANHVIEN, NOT NULL | Hạng thành viên         |

**Business Rules** `[USER-PROVIDED]`:

- 1 điểm = 1.000 VNĐ giảm giá
- `SoDienThoai` phải UNIQUE
- `DiemTichLuy` và `TongChiTieu` được cập nhật sau mỗi thanh toán thành công
- `MaHang` (hạng thành viên) được tự động nâng khi vượt ngưỡng

**Unknowns:**

- Công thức tích điểm: 1 điểm mỗi 10.000 VNĐ hay 1.000 VNĐ?
- `DiemTichLuy` có thể âm (khi dùng điểm) hay có sàn = 0?
- Có lưu lịch sử điểm không?

---

### 3.9 HANGTHANHVIEN — Hạng Thành Viên

| Thuộc tính      | Chi tiết                                          | Evidence        |
| --------------- | ------------------------------------------------- | --------------- |
| Domain          | Customer & Loyalty Management                     | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Định nghĩa các hạng thành viên và ngưỡng chi tiêu | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột           | Kiểu dữ liệu (giả định) | Constraint   | Ghi chú                             |
| ------------- | ----------------------- | ------------ | ----------------------------------- |
| MaHang        | NVARCHAR(10)            | PK, NOT NULL | Mã hạng                             |
| TenHang       | NVARCHAR(50)            | NOT NULL     | Tên hạng                            |
| NguongChiTieu | DECIMAL(18,2)           | NOT NULL     | Ngưỡng tổng chi tiêu tối thiểu      |
| HeSoTichDiem  | DECIMAL(5,2)            | NULL         | Hệ số tích điểm (chưa chắc tồn tại) |

**Business Rules** `[USER-PROVIDED]`:

| Mã Hạng | Tên Hạng | Ngưỡng Chi Tiêu  |
| ------- | -------- | ---------------- |
| DONG    | Đồng     | 0 VNĐ (mặc định) |
| BAC     | Bạc      | 2.000.000 VNĐ    |
| VANG    | Vàng     | 8.000.000 VNĐ    |

**Unknowns:**

- Giá trị `MaHang` chính xác: "DONG"/"BAC"/"VANG" hay 1/2/3?
- Có hạng KIM CUONG hay hạng cao hơn không?
- Có cột quyền lợi (ưu đãi) cho từng hạng không?

---

### 3.10 CHUCVU — Chức Vụ Nhân Viên

| Thuộc tính      | Chi tiết                                                       | Evidence        |
| --------------- | -------------------------------------------------------------- | --------------- |
| Domain          | HR Management                                                  | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Danh mục chức vụ nghiệp vụ nhân sự. **KHÔNG phải system role** | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột           | Kiểu dữ liệu (giả định) | Constraint   | Ghi chú                               |
| ------------- | ----------------------- | ------------ | ------------------------------------- |
| MaChucVu      | INT / NVARCHAR          | PK, NOT NULL | Mã chức vụ                            |
| TenChucVu     | NVARCHAR(100)           | NOT NULL     | Tên chức vụ (Quản lý, Thu ngân, Kho…) |
| MucLuongCoBan | DECIMAL(18,2)           | NOT NULL     | Mức lương cơ bản                      |

> [!NOTE]
> `CHUCVU` là chức vụ nghiệp vụ HR (Quản lý, Thu ngân, Nhân viên kho…). Để mapping sang system role (Admin, Cashier, StoreKeeper…) cần xử lý riêng ở Identity Service — **không tự động tương đương**.

**Unknowns:**

- Danh sách chức vụ thực tế (Quản lý cửa hàng, Thu ngân, Nhân viên kho…)?
- Mapping CHUCVU → System Role sẽ được định nghĩa ở đâu?

---

### 3.11 NHANVIEN — Nhân Viên

| Thuộc tính      | Chi tiết                                                                | Evidence        |
| --------------- | ----------------------------------------------------------------------- | --------------- |
| Domain          | HR Management                                                           | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Thông tin nhân viên và FK đến chức vụ. Được tham chiếu bởi nhiều domain | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột         | Kiểu dữ liệu (giả định) | Constraint            | Ghi chú                              |
| ----------- | ----------------------- | --------------------- | ------------------------------------ |
| MaNhanVien  | INT / NVARCHAR          | PK, NOT NULL          | Mã nhân viên                         |
| TenNhanVien | NVARCHAR(200)           | NOT NULL              | Tên nhân viên                        |
| MaChucVu    | INT / NVARCHAR          | FK → CHUCVU, NOT NULL | Chức vụ                              |
| NgaySinh    | DATE                    | NOT NULL              | Ngày sinh (có CHECK constraint tuổi) |
| SoDienThoai | NVARCHAR(15)            | NOT NULL              | Số điện thoại                        |
| DiaChi      | NVARCHAR(500)           | NULL                  | Địa chỉ                              |
| GioiTinh    | NVARCHAR(3) / BIT       | NOT NULL              | Giới tính                            |
| NgayVaoLam  | DATE                    | NULL                  | Ngày vào làm (chưa chắc tồn tại)     |

**Business Rules** `[USER-PROVIDED]`:

- Có CHECK constraint ràng buộc tuổi (chi tiết chưa biết)
- `SoDienThoai` phải tuân thủ database constraints (format chưa biết)

> [!WARNING]
> NHANVIEN là bảng được nhiều domain tham chiếu nhất (HOADON, PHIEUNHAP, PHANCA, PHIEUHUY). Đây là điểm coupling cao nhất trong database.

**Unknowns:**

- CHECK constraint tuổi cụ thể (VD: `DATEDIFF(YEAR, NgaySinh, GETDATE()) >= 18`)?
- Format validation SoDienThoai (regex)?
- Có cột TrangThai (đang làm việc / nghỉ việc) không?

---

### 3.12 CALAMVIEC — Ca Làm Việc

| Thuộc tính      | Chi tiết                                                  | Evidence        |
| --------------- | --------------------------------------------------------- | --------------- |
| Domain          | HR Management                                             | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Định nghĩa các ca làm việc (sáng, chiều, tối) và lương ca | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột        | Kiểu dữ liệu (giả định) | Constraint   | Ghi chú                            |
| ---------- | ----------------------- | ------------ | ---------------------------------- |
| MaCa       | INT / NVARCHAR          | PK, NOT NULL | Mã ca làm việc                     |
| TenCa      | NVARCHAR(50)            | NOT NULL     | Tên ca (Ca sáng, Ca chiều, Ca tối) |
| GioBatDau  | TIME                    | NOT NULL     | Giờ bắt đầu ca                     |
| GioKetThuc | TIME                    | NOT NULL     | Giờ kết thúc ca                    |
| LuongCa    | DECIMAL(18,2)           | NOT NULL     | Lương cho một ca làm việc          |

**Unknowns:**

- Có thể ca vắt ngày (22:00 - 06:00) — cách xử lý?
- `LuongCa` cố định hay theo hệ số × lương cơ bản?

---

### 3.13 PHANCA — Phân Ca Làm Việc

| Thuộc tính      | Chi tiết                                                               | Evidence        |
| --------------- | ---------------------------------------------------------------------- | --------------- |
| Domain          | HR Management                                                          | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Ghi nhận nhân viên nào làm ca nào vào ngày nào và trạng thái chấm công | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột           | Kiểu dữ liệu (giả định) | Constraint               | Ghi chú              |
| ------------- | ----------------------- | ------------------------ | -------------------- |
| MaPhieuPhanca | INT                     | PK (surrogate), NOT NULL | Mã phiếu phân ca     |
| MaNhanVien    | INT / NVARCHAR          | FK → NHANVIEN, NOT NULL  | Nhân viên            |
| MaCa          | INT / NVARCHAR          | FK → CALAMVIEC, NOT NULL | Ca làm việc          |
| NgayLamViec   | DATE                    | NOT NULL                 | Ngày làm việc        |
| TrangThai     | NVARCHAR(50)            | NOT NULL                 | Trạng thái chấm công |

**Business Rules** `[USER-PROVIDED]`:

- Chỉ ca có `TrangThai = "Có mặt"` mới được tính lương trong `vw_BaoCaoLuongVaDoanhSoNV`

**Unknowns:**

- Primary Key: surrogate (`MaPhieuPhanca`) hay composite `(MaNhanVien, MaCa, NgayLamViec)`?
- Các giá trị `TrangThai` khác: "Vắng mặt", "Vắng có phép"?
- Unique constraint trên `(MaNhanVien, MaCa, NgayLamViec)`?

---

### 3.14 PHIEUHUY — Phiếu Hủy Hàng

| Thuộc tính      | Chi tiết                                                  | Evidence        |
| --------------- | --------------------------------------------------------- | --------------- |
| Domain          | Inventory Loss Management                                 | [USER-PROVIDED] |
| Mô tả nghiệp vụ | Ghi nhận hàng hoá bị hủy do hỏng, hết hạn hoặc lý do khác | [USER-PROVIDED] |

**Cột suy luận** `[ASSUMPTION]`:

| Cột        | Kiểu dữ liệu (giả định) | Constraint              | Ghi chú                   |
| ---------- | ----------------------- | ----------------------- | ------------------------- |
| MaPhieuHuy | INT / NVARCHAR          | PK, NOT NULL            | Mã phiếu hủy              |
| MaHang     | INT / NVARCHAR          | FK → HANGHOA, NOT NULL  | Hàng hoá bị hủy           |
| MaNhanVien | INT / NVARCHAR          | FK → NHANVIEN, NOT NULL | Nhân viên lập phiếu       |
| SoLuongHuy | INT                     | NOT NULL, CHECK > 0     | Số lượng hủy              |
| LyDo       | NVARCHAR(500)           | NOT NULL                | Lý do hủy                 |
| NgayHuy    | DATETIME                | NOT NULL                | Ngày hủy                  |
| GiaVon     | DECIMAL(18,2)           | NULL                    | Giá vốn tại thời điểm hủy |
| TrangThai  | NVARCHAR(50)            | NOT NULL                | Trạng thái phiếu hủy      |

**Cross-Domain FKs** `[USER-PROVIDED]`:

- `MaHang → HANGHOA` (Inventory Loss → Product domain)
- `MaNhanVien → NHANVIEN` (Inventory Loss → HR domain)

**Unknowns:**

- Việc hủy hàng có trừ trực tiếp `HANGHOA.SoLuongTon` không? Hay qua SP riêng?
- Giá trị `TrangThai`: "Chờ duyệt" / "Đã duyệt"?
- Có approval workflow không?

---

## 4. View và Stored Procedures

### 4.1 View: vw_BaoCaoLuongVaDoanhSoNV

| Thuộc tính    | Chi tiết                                 | Evidence        |
| ------------- | ---------------------------------------- | --------------- |
| Mô tả         | Báo cáo lương và doanh số theo nhân viên | [USER-PROVIDED] |
| Nguồn dữ liệu | JOIN NHANVIEN + CHUCVU + PHANCA + HOADON | [ASSUMPTION]    |

**Business Rules tích hợp** `[USER-PROVIDED]`:

- Chỉ ca có `PHANCA.TrangThai = "Có mặt"` được tính lương
- Chỉ hoá đơn có `HOADON.TrangThai = "Đã thanh toán"` được tính doanh thu

**UNKNOWNS quan trọng:**

- Công thức tính lương chính xác: `LuongCa × số ca có mặt` + `MucLuongCoBan` hay chỉ `LuongCa`?
- Cách tổng hợp doanh số: `SUM(TongTien)` hay `SUM(ThanhTien từ CT_HOADON)`?
- Kỳ báo cáo: theo tháng, theo ngày, hay tuỳ chọn?
- Body của View (chưa có SQL)

---

### 4.2 Stored Procedure: usp_ThanhToanHoaDon

| Thuộc tính            | Chi tiết                                           | Evidence        |
| --------------------- | -------------------------------------------------- | --------------- |
| Mô tả                 | Xử lý thanh toán hoá đơn — nghiệp vụ phức tạp nhất | [USER-PROVIDED] |
| Service được phép gọi | `sales-service` (DUY NHẤT)                         | [PROPOSAL]      |

**Business Rules** `[USER-PROVIDED]`:

1. Chỉ xử lý hoá đơn trạng thái `"Mới tạo"`
2. Hoá đơn phải có ít nhất 1 chi tiết
3. Kiểm tra tồn kho từng mặt hàng trong CT_HOADON
4. **Không bán vượt tồn kho** (validation bắt buộc)
5. Trừ `SoLuongTon` trong HANGHOA cho từng mặt hàng
6. Cập nhật `TrangThai` hoá đơn → `"Đã thanh toán"`
7. Nếu có `MaKhachHang`: cập nhật `TongChiTieu` và `DiemTichLuy` trong KHACHHANG
8. Cập nhật `MaHang` (hạng thành viên) nếu `TongChiTieu` vượt ngưỡng

**Phân tích bảng** `[ASSUMPTION]`:

| Thao tác | Bảng          | Cột                              |
| -------- | ------------- | -------------------------------- |
| READ     | HOADON        | TrangThai, MaKhachHang           |
| READ     | CT_HOADON     | MaHang, SoLuong, DonGia          |
| READ     | HANGHOA       | SoLuongTon                       |
| READ     | KHACHHANG     | DiemTichLuy, TongChiTieu         |
| READ     | HANGTHANHVIEN | NguongChiTieu                    |
| WRITE    | HANGHOA       | SoLuongTon (trừ)                 |
| WRITE    | HOADON        | TrangThai                        |
| WRITE    | KHACHHANG     | TongChiTieu, DiemTichLuy, MaHang |

**Transaction** `[ASSUMPTION]`: Sử dụng `BEGIN TRAN / COMMIT / ROLLBACK`

> [!CAUTION]
> **[RISK]** SP này ghi vào 3 domain (Sales, Product, Customer). Nếu tách database vật lý, SP này phải được tái triển khai thành Saga Pattern.

**UNKNOWNS:**

- Cú pháp SQL chính xác
- Công thức tích điểm (VD: `SoLuongTon += FLOOR(TongTien / 10000)`)
- Cơ chế rollback cụ thể khi stock-out xảy ra giữa chừng
- Có kiểm tra `DiemSuDung` hợp lệ (đủ điểm) không?

---

### 4.3 Stored Procedure: usp_HoanThanhPhieuNhap

| Thuộc tính            | Chi tiết                                 | Evidence        |
| --------------------- | ---------------------------------------- | --------------- |
| Mô tả                 | Hoàn thành phiếu nhập hàng, cộng tồn kho | [USER-PROVIDED] |
| Service được phép gọi | `purchase-service` (DUY NHẤT)            | [PROPOSAL]      |

**Business Rules** `[USER-PROVIDED]`:

1. Chỉ xử lý phiếu trạng thái **chưa hoàn thành**
2. Phiếu phải có ít nhất 1 chi tiết
3. **Idempotency**: Chỉ xử lý một lần
4. Cộng `SoLuongTon` trong HANGHOA cho từng mặt hàng trong CT_PHIEUNHAP
5. Cập nhật `TrangThai` phiếu nhập → `"Hoàn thành"`

**Phân tích bảng** `[ASSUMPTION]`:

| Thao tác | Bảng         | Cột                 |
| -------- | ------------ | ------------------- |
| READ     | PHIEUNHAP    | TrangThai           |
| READ     | CT_PHIEUNHAP | MaHang, SoLuongNhap |
| WRITE    | HANGHOA      | SoLuongTon (cộng)   |
| WRITE    | PHIEUNHAP    | TrangThai           |

**UNKNOWNS:**

- Cơ chế idempotency: chỉ dùng kiểm tra TrangThai hay có thêm cột ProcessedAt?
- Có transaction rollback khi lỗi giữa chừng không?
- Hành vi khi gọi SP 2 lần: Error hay silent no-op?

---

## 5. ERD Mô Tả (Text)

> `[USER-PROVIDED]` — Các quan hệ được suy luận từ tên bảng và business rules. Chưa có SQL để xác nhận.

```
HANGTHANHVIEN (MaHang) ◄──── KHACHHANG (MaHang FK)
LOAIHANG (MaLoai)      ◄──── HANGHOA (MaLoai FK)
CHUCVU (MaChucVu)      ◄──── NHANVIEN (MaChucVu FK)
NHACUNGCAP (MaNCC)     ◄──── PHIEUNHAP (MaNCC FK)
NHANVIEN (MaNhanVien)  ◄──── PHIEUNHAP (MaNhanVien FK)
PHIEUNHAP (MaPhieuNhap)◄──── CT_PHIEUNHAP (MaPhieuNhap FK)
HANGHOA (MaHang)       ◄──── CT_PHIEUNHAP (MaHang FK)
KHACHHANG (MaKhachHang)◄──── HOADON (MaKhachHang FK, NULLABLE)
NHANVIEN (MaNhanVien)  ◄──── HOADON (MaNhanVien FK)
HOADON (MaHoaDon)      ◄──── CT_HOADON (MaHoaDon FK)
HANGHOA (MaHang)       ◄──── CT_HOADON (MaHang FK)
NHANVIEN (MaNhanVien)  ◄──── PHANCA (MaNhanVien FK)
CALAMVIEC (MaCa)       ◄──── PHANCA (MaCa FK)
HANGHOA (MaHang)       ◄──── PHIEUHUY (MaHang FK)
NHANVIEN (MaNhanVien)  ◄──── PHIEUHUY (MaNhanVien FK)
```

### ERD Dạng Mermaid (Phác Thảo)

```mermaid
erDiagram
    LOAIHANG {
        PK MaLoai
        string TenLoai
    }
    HANGHOA {
        PK MaHang
        FK MaLoai
        string TenHang
        decimal GiaBan
        int SoLuongTon
    }
    HANGTHANHVIEN {
        PK MaHang
        string TenHang
        decimal NguongChiTieu
    }
    KHACHHANG {
        PK MaKhachHang
        FK MaHang
        string TenKhachHang
        string SoDienThoai
        int DiemTichLuy
        decimal TongChiTieu
    }
    CHUCVU {
        PK MaChucVu
        string TenChucVu
        decimal MucLuongCoBan
    }
    NHANVIEN {
        PK MaNhanVien
        FK MaChucVu
        string TenNhanVien
        date NgaySinh
    }
    NHACUNGCAP {
        PK MaNCC
        string TenNCC
        string SoDienThoai
    }
    PHIEUNHAP {
        PK MaPhieuNhap
        FK MaNCC
        FK MaNhanVien
        datetime NgayNhap
        string TrangThai
    }
    CT_PHIEUNHAP {
        FK MaPhieuNhap
        FK MaHang
        int SoLuongNhap
        decimal GiaNhap
    }
    HOADON {
        PK MaHoaDon
        FK MaKhachHang
        FK MaNhanVien
        datetime NgayLap
        string TrangThai
        decimal TongTien
    }
    CT_HOADON {
        FK MaHoaDon
        FK MaHang
        int SoLuong
        decimal DonGia
        decimal ThanhTien
    }
    CALAMVIEC {
        PK MaCa
        string TenCa
        time GioBatDau
        time GioKetThuc
        decimal LuongCa
    }
    PHANCA {
        PK MaPhieuPhanca
        FK MaNhanVien
        FK MaCa
        date NgayLamViec
        string TrangThai
    }
    PHIEUHUY {
        PK MaPhieuHuy
        FK MaHang
        FK MaNhanVien
        int SoLuongHuy
        string LyDo
        string TrangThai
    }

    LOAIHANG ||--o{ HANGHOA : "MaLoai"
    HANGTHANHVIEN ||--o{ KHACHHANG : "MaHang"
    CHUCVU ||--o{ NHANVIEN : "MaChucVu"
    NHACUNGCAP ||--o{ PHIEUNHAP : "MaNCC"
    NHANVIEN ||--o{ PHIEUNHAP : "MaNhanVien"
    PHIEUNHAP ||--o{ CT_PHIEUNHAP : "MaPhieuNhap"
    HANGHOA ||--o{ CT_PHIEUNHAP : "MaHang"
    KHACHHANG |o--o{ HOADON : "MaKhachHang (nullable)"
    NHANVIEN ||--o{ HOADON : "MaNhanVien"
    HOADON ||--o{ CT_HOADON : "MaHoaDon"
    HANGHOA ||--o{ CT_HOADON : "MaHang"
    NHANVIEN ||--o{ PHANCA : "MaNhanVien"
    CALAMVIEC ||--o{ PHANCA : "MaCa"
    HANGHOA ||--o{ PHIEUHUY : "MaHang"
    NHANVIEN ||--o{ PHIEUHUY : "MaNhanVien"
```

---

## 6. Cross-Domain FK Analysis

> [!IMPORTANT]
> Đây là thách thức kiến trúc lớn nhất khi tiến hành tách database vật lý.

| #   | FK Relationship                   | Source Domain  | Target Domain | Tác động Microservices              |
| --- | --------------------------------- | -------------- | ------------- | ----------------------------------- |
| 1   | `HOADON.MaNhanVien → NHANVIEN`    | Sales          | HR            | Sales cần HR data khi tạo HĐ        |
| 2   | `PHIEUNHAP.MaNhanVien → NHANVIEN` | Purchase       | HR            | Purchase cần HR data khi tạo PN     |
| 3   | `PHIEUHUY.MaNhanVien → NHANVIEN`  | Inventory Loss | HR            | InvLoss cần HR data khi tạo PH      |
| 4   | `CT_PHIEUNHAP.MaHang → HANGHOA`   | Purchase       | Product       | Purchase cần check Product khi nhập |
| 5   | `CT_HOADON.MaHang → HANGHOA`      | Sales          | Product       | Sales cần check stock khi bán       |
| 6   | `PHIEUHUY.MaHang → HANGHOA`       | Inventory Loss | Product       | InvLoss cần Product data            |
| 7   | `HOADON.MaKhachHang → KHACHHANG`  | Sales          | Customer      | Sales cần Customer data             |

**Phân tích:** 7 FK xuyên domain trong cơ sở dữ liệu duy nhất. Giai đoạn 1 dùng Shared Database để giữ nguyên các FK này. Giai đoạn 2 phải loại bỏ từng FK và thay bằng application-level reference hoặc event-driven consistency.

---

## 7. Business Rules Tổng Hợp

| #   | Business Rule                                  | Evidence        | Nguồn                       |
| --- | ---------------------------------------------- | --------------- | --------------------------- |
| 1   | Không bán vượt tồn kho                         | [USER-PROVIDED] | usp_ThanhToanHoaDon         |
| 2   | Không thanh toán hoá đơn hai lần               | [USER-PROVIDED] | usp_ThanhToanHoaDon         |
| 3   | Không hoàn thành phiếu nhập hai lần            | [USER-PROVIDED] | usp_HoanThanhPhieuNhap      |
| 4   | Khách mua lẻ không được dùng điểm              | [USER-PROVIDED] | HOADON.MaKhachHang nullable |
| 5   | 1 điểm = 1.000 VNĐ giảm giá                    | [USER-PROVIDED] | Loyalty rules               |
| 6   | Ngưỡng Bạc: 2.000.000 VNĐ                      | [USER-PROVIDED] | HANGTHANHVIEN               |
| 7   | Ngưỡng Vàng: 8.000.000 VNĐ                     | [USER-PROVIDED] | HANGTHANHVIEN               |
| 8   | Chỉ ca "Có mặt" mới tính lương                 | [USER-PROVIDED] | vw_BaoCaoLuongVaDoanhSoNV   |
| 9   | Chỉ HĐ "Đã thanh toán" mới tính doanh thu      | [USER-PROVIDED] | vw_BaoCaoLuongVaDoanhSoNV   |
| 10  | Nhân viên có ràng buộc tuổi (CHECK constraint) | [USER-PROVIDED] | NHANVIEN                    |
| 11  | SoDienThoai khách hàng phải UNIQUE             | [USER-PROVIDED] | KHACHHANG                   |
| 12  | SoDienThoai nhân viên có ràng buộc format      | [USER-PROVIDED] | NHANVIEN                    |

---

## 8. Risks và Điểm Bất Hợp Lý

| #   | Loại   | Mô tả                                      | Tác động                              | Đề xuất                                   |
| --- | ------ | ------------------------------------------ | ------------------------------------- | ----------------------------------------- |
| 1   | [RISK] | `SoLuongTon` bị 3 luồng cập nhật đồng thời | Race condition, oversell              | Distributed lock hoặc pessimistic locking |
| 2   | [RISK] | Không có bảng TAIKHOAN/LOGIN rõ ràng       | Identity Service không có bảng sở hữu | `[PROPOSAL]` Tạo bảng TAIKHOAN mới        |
| 3   | [RISK] | 7 FK xuyên domain                          | Không thể tách database vật lý ngay   | Shared Database giai đoạn 1               |
| 4   | [RISK] | Công thức tích điểm chưa được xác định     | Implement sai logic                   | Xác minh ngay với stakeholder             |
| 5   | [RISK] | `usp_ThanhToanHoaDon` ghi 3 domain         | Khó tích hợp Microservices            | Chỉ `sales-service` được gọi SP này       |

---

## 9. UNKNOWNS & UNVERIFIED (Cần Xác Minh)

| Ưu tiên | Unknown                                                           | Lý do quan trọng                      |
| ------- | ----------------------------------------------------------------- | ------------------------------------- |
| P0      | SQL script đầy đủ của database                                    | Tất cả thông tin hiện tại là giả định |
| P0      | Body của `usp_ThanhToanHoaDon`                                    | Quyết định transaction boundary       |
| P0      | Body của `usp_HoanThanhPhieuNhap`                                 | Quyết định transaction boundary       |
| P1      | Công thức tích điểm tích lũy                                      | Logic nghiệp vụ cốt lõi               |
| P1      | CHECK constraint tuổi nhân viên                                   | Validation rule quan trọng            |
| P1      | Giá trị TrangThai chính xác                                       | Ảnh hưởng state machine design        |
| P1      | Composite PK hay surrogate PK cho CT_HOADON, CT_PHIEUNHAP, PHANCA | Ảnh hưởng ORM mapping                 |
| P2      | Tên cột chính xác từng bảng                                       | Code generation accuracy              |
| P2      | Kiểu dữ liệu chính xác                                            | Schema migration                      |
| P2      | Body của `vw_BaoCaoLuongVaDoanhSoNV`                              | Công thức lương chính xác             |
| P2      | Có bảng TAIKHOAN không?                                           | Identity Service design               |
| P3      | Format validation SoDienThoai                                     | Validation rule                       |
| P3      | Số cửa hàng dự kiến                                               | Scale architecture                    |

---

_Document generated: Stage 1 Architecture Analysis_
_Status: DRAFT — Pending SQL script verification_
_Author: Senior Software Architect (AI-assisted)_
