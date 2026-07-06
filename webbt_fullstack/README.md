# Website VNVD — Full-stack (Frontend + Backend + MySQL)

Website quảng bá & bán dịch vụ chuyển đổi số của VNVD, đã được **nâng cấp từ bản demo tĩnh
(dữ liệu giả trong localStorage) thành ứng dụng full-stack thực sự**:

- **Backend** Node.js + Express, kết nối **MySQL** theo đúng `db/schema.sql`.
- **REST API** đầy đủ: xác thực + phân quyền admin/khách hàng, sản phẩm/dịch vụ, giỏ hàng,
  đơn hàng (checkout), và trang quản trị (users/orders/products/stats).
- **Chatbot AI** (Google Gemini) proxy an toàn phía server — giữ nguyên như bản trước.
- Frontend gọi API backend; **vẫn tự chạy được ở chế độ offline** (fallback localStorage)
  khi mở file tĩnh không có server — giao diện & tính năng giữ nguyên 100%.

---

## 1. Yêu cầu hệ thống

| Thành phần | Phiên bản |
|-----------|-----------|
| Node.js   | >= 18 (khuyến nghị 20 LTS) |
| MySQL     | >= 8.0 (InnoDB, utf8mb4) |
| npm       | đi kèm Node |

---

## 2. Cài đặt

```bash
# 1) Cài dependencies
npm install

# 2) Tạo file cấu hình .env từ mẫu
cp .env.example .env
#    → mở .env, điền DB_USER / DB_PASSWORD (và JWT_SECRET, GEMINI_API_KEY nếu cần)
```

### `.env` các biến chính

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<mật khẩu MySQL của bạn>
DB_NAME=website_vnpt

JWT_SECRET=<chuỗi ngẫu nhiên dài>
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=<tùy chọn — để trống nếu không dùng chatbot>
GEMINI_MODEL=gemini-flash-latest
PORT=3000
```

---

## 3. Khởi tạo cơ sở dữ liệu

### Cách A — tự động (khuyến nghị)

Script sẽ import `schema.sql` + `seed.sql` và tạo tài khoản admin demo (băm mật khẩu tại chỗ):

```bash
npm run db:init
```

### Cách B — thủ công bằng MySQL client

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

> Lưu ý cách B: mật khẩu admin dùng hash bcrypt sẵn trong `seed.sql` (tương ứng `admin123`).
> Nếu muốn chắc chắn, cứ chạy thêm `npm run db:init` để ghi đè hash admin bằng bản sinh mới.

---

## 4. Chạy server

```bash
npm start
# hoặc chế độ tự reload khi sửa code:
npm run dev
```

Mở trình duyệt: **http://localhost:3000**

---

## 5. Tài khoản demo

| Vai trò | Email | Mật khẩu |
|--------|-------|----------|
| **Admin** (quản trị) | `admin@vnvd.vn` | `admin123` |
| Khách hàng | *tự đăng ký trên web* | *(tối thiểu 8 ký tự)* |

- Đăng nhập admin → hiện nút **“Trang quản trị”** trong menu người dùng → mở Dashboard
  (thống kê + danh sách người dùng / dịch vụ / đơn hàng, lấy realtime từ DB).
- Khách hàng: duyệt web thoải mái; **thêm giỏ & thanh toán yêu cầu đăng nhập**.

---

## 6. Danh sách API endpoint

Base URL: `http://localhost:3000`

### Xác thực — `/api/auth`
| Method | Đường dẫn | Mô tả | Body |
|-------|-----------|-------|------|
| POST | `/api/auth/register` | Đăng ký khách hàng | `{ firstName, lastName, email, phone?, password }` |
| POST | `/api/auth/login` | Đăng nhập (admin hoặc khách) | `{ email, password }` |
| GET  | `/api/auth/me` | Thông tin người đang đăng nhập | *(Bearer token)* |

### Sản phẩm / dịch vụ — `/api/products`
| Method | Đường dẫn | Mô tả |
|-------|-----------|-------|
| GET | `/api/products` | Danh sách (lọc `?type=dich_vu_so\|combo`, `?category=1\|2`) |
| GET | `/api/products/:code` | Chi tiết theo mã (vd `svc-001`, `pkg-basic`) |

### Giỏ hàng — `/api/cart` *(cần đăng nhập khách hàng)*
| Method | Đường dẫn | Mô tả |
|-------|-----------|-------|
| GET | `/api/cart` | Lấy giỏ hàng |
| POST | `/api/cart` | Thêm `{ code, qty? }` |
| PUT | `/api/cart/:code` | Đặt số lượng `{ qty }` |
| DELETE | `/api/cart/:code` | Xóa 1 dòng |
| DELETE | `/api/cart` | Xóa toàn bộ |

### Đơn hàng — `/api/orders` *(cần đăng nhập khách hàng)*
| Method | Đường dẫn | Mô tả |
|-------|-----------|-------|
| POST | `/api/orders` | Checkout — tạo đơn từ giỏ hàng |
| GET | `/api/orders` | Danh sách đơn của tôi |
| GET | `/api/orders/:ma` | Chi tiết 1 đơn |

### Quản trị — `/api/admin` *(cần role admin)*
| Method | Đường dẫn | Mô tả |
|-------|-----------|-------|
| GET | `/api/admin/stats` | Thống kê (users, services, orders, revenue) |
| GET | `/api/admin/users` | Danh sách khách hàng |
| GET | `/api/admin/products` | Danh sách sản phẩm |
| GET | `/api/admin/orders` | Danh sách đơn hàng toàn hệ thống |

### Khác
| Method | Đường dẫn | Mô tả |
|-------|-----------|-------|
| GET | `/api/health` | Healthcheck (frontend dùng để dò backend) |
| POST | `/api/chat` | Proxy chatbot AI Gemini `{ message, history? }` |

---

## 7. Cấu trúc thư mục

```
webbt_fullstack/
├── server.js              # Điểm vào Express: mount API + static + chatbot
├── package.json
├── .env.example           # Mẫu cấu hình (copy thành .env)
├── db/
│   ├── schema.sql         # Cấu trúc CSDL (đề bài cung cấp)
│   └── seed.sql           # Dữ liệu mẫu: vai trò, admin, 11 sản phẩm, danh mục...
├── src/
│   ├── db.js              # Pool kết nối MySQL
│   ├── auth-mw.js         # JWT + băm mật khẩu + middleware phân quyền
│   ├── shape.js           # Chuyển đổi bản ghi DB <-> shape frontend + icon/color
│   ├── init-db.js         # Tiện ích import schema+seed + tạo admin (npm run db:init)
│   └── routes/
│       ├── auth.js        # /api/auth/*
│       ├── products.js    # /api/products/*
│       ├── cart.js        # /api/cart/*
│       ├── orders.js      # /api/orders/*
│       └── admin.js       # /api/admin/*
└── public/                # Toàn bộ frontend (giao diện giữ nguyên)
    ├── index.html
    ├── style.css
    ├── api.js             # Lớp gọi API (window.VNVDApi) + tự dò backend
    ├── auth.js  cart.js  admin.js   # đã nối API, có fallback offline
    ├── pages.js main.js chat.js carousel.js
    └── images/
```

---

## 8. Ghi chú thiết kế

- **Ánh xạ sản phẩm:** frontend dùng mã `svc-001..svc-008`, `pkg-basic/business/premium`.
  Các mã này được lưu vào cột `san_pham.ma_san_pham`; icon & màu hiển thị (không có trong
  schema) được ánh xạ trong `src/shape.js` để giữ đúng giao diện cũ.
- **Phân quyền:** admin nằm ở bảng `nhan_vien` (join `vai_tro`), khách hàng ở `khach_hang`.
  Đăng nhập thử admin trước, không thấy thì thử khách hàng. Token JWT mang `role`.
- **Giỏ hàng & đơn hàng:** lưu theo `khach_hang_id`. Checkout dùng transaction để tạo
  `don_hang` + `don_hang_chi_tiet` + `lich_su_trang_thai_don_hang`, rồi dọn giỏ.
- **Chế độ offline:** nếu không có backend (mở tĩnh), `api.js` đặt `available=false` và các
  module tự chạy bằng localStorage như bản demo — nên giao diện không bao giờ “vỡ”.
