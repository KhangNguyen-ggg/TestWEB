# 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY WEBSITE VNVD FULL-STACK

> **Phiên bản:** 2.1.0 (đã sửa lỗi)  
> **Stack:** Node.js + Express + MySQL + HTML/CSS/JS  
> **Thời gian cài đặt ước tính:** 10–15 phút

---

## 📋 YÊU CẦU HỆ THỐNG

| Phần mềm | Phiên bản tối thiểu | Tải về |
|----------|---------------------|--------|
| Node.js  | 18.0.0+             | https://nodejs.org |
| MySQL hoặc MariaDB | 8.0+ / 10.5+ | https://dev.mysql.com/downloads/ hoặc https://mariadb.org |
| npm      | Đi kèm Node.js      | — |

> **Kiểm tra đã cài chưa:**
> ```bash
> node --version    # phải >= v18.0.0
> npm --version
> mysql --version
> ```

---

## 📁 CẤU TRÚC THƯ MỤC

```
webbt_fullstack/
├── backend/
│   ├── server.js          ← Entry point (khởi động tại đây)
│   ├── api/               ← Các route API (auth, products, cart, orders, admin)
│   └── db/
│       ├── db.js          ← Kết nối MySQL pool
│       ├── init-db.js     ← Script khởi tạo database
│       ├── schema.sql     ← Cấu trúc bảng
│       └── seed.sql       ← Dữ liệu mẫu
├── frontend/
│   ├── index.html         ← Trang chủ (SPA)
│   ├── assets/style.css   ← CSS
│   └── js/                ← JavaScript modules
├── .env.example           ← Mẫu cấu hình môi trường
├── package.json
└── HUONG_DAN_CHAY.md      ← File này
```

---

## 🔧 BƯỚC 1: CÀI ĐẶT PHẦN MỀM CẦN THIẾT

### 1.1 Cài Node.js
- Truy cập https://nodejs.org → tải bản **LTS** (Long Term Support)
- Chạy file cài đặt, chọn "Add to PATH"
- Mở Terminal/CMD mới, kiểm tra: `node --version`

### 1.2 Cài MySQL (hoặc MariaDB)
**Windows:** Tải MySQL Installer từ https://dev.mysql.com/downloads/installer/  
**macOS:** `brew install mysql` hoặc tải từ trang chủ  
**Ubuntu/Debian:** `sudo apt install mysql-server`

> **Lưu ý:** Ghi nhớ mật khẩu root MySQL khi cài đặt!

---

## 🗄️ BƯỚC 2: CẤU HÌNH DATABASE

### 2.1 Đăng nhập MySQL
```bash
mysql -u root -p
# Nhập mật khẩu root khi được hỏi
```

### 2.2 Tạo user cho ứng dụng (khuyến nghị, an toàn hơn dùng root)
```sql
CREATE USER 'vnvd_user'@'localhost' IDENTIFIED BY 'MatKhauManh123!';
GRANT ALL PRIVILEGES ON website_vnpt.* TO 'vnvd_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> **Hoặc** nếu muốn dùng root trực tiếp (không khuyến nghị cho production):  
> Bỏ qua bước tạo user, dùng `DB_USER=root` và `DB_PASSWORD=<mật khẩu root>` ở Bước 3.

---

## ⚙️ BƯỚC 3: CẤU HÌNH FILE .ENV

### 3.1 Sao chép file mẫu
```bash
# Trong thư mục dự án (webbt_fullstack/)
cp .env.example .env
```

### 3.2 Mở file `.env` bằng Notepad/VS Code và điền thông tin thật:
```env
# Kết nối database
DB_HOST=localhost
DB_PORT=3306
DB_USER=vnvd_user          ← tên user vừa tạo (hoặc root)
DB_PASSWORD=MatKhauManh123! ← mật khẩu user
DB_NAME=website_vnpt
DB_CONNECTION_LIMIT=10

# Bảo mật JWT — ĐỔI thành chuỗi ngẫu nhiên dài!
JWT_SECRET=thay_bang_chuoi_ngau_nhien_rat_dai_va_phuc_tap_2025
JWT_EXPIRES_IN=7d

# Chatbot AI Gemini (tùy chọn — bỏ trống nếu không dùng)
# Lấy API key miễn phí tại: https://aistudio.google.com/apikey
GEMINI_API_KEY=
GEMINI_MODEL=gemini-flash-latest

# Cổng server
PORT=3000
```

> ⚠️ **Quan trọng:** Không commit file `.env` lên Git! File này đã có trong `.gitignore`.

---

## 📦 BƯỚC 4: CÀI DEPENDENCIES (npm install)

Mở Terminal/CMD, di chuyển vào thư mục dự án:
```bash
cd đường/dẫn/đến/webbt_fullstack

npm install
```

Chờ khoảng 30–60 giây. Khi thấy dòng `added X packages` là xong.

---

## 🗃️ BƯỚC 5: KHỞI TẠO DATABASE

Lệnh này sẽ tự động:
- Tạo database `website_vnpt`
- Tạo tất cả các bảng (schema)
- Nhập dữ liệu mẫu (8 dịch vụ, 3 gói bảng giá)
- Tạo tài khoản admin demo

```bash
npm run db:init
```

**Kết quả thành công:**
```
→ Đang import db/schema.sql ...
→ Đang import db/seed.sql ...
→ Đang tạo tài khoản admin demo ...

✅ Khởi tạo CSDL hoàn tất.
   Database : website_vnpt
   Admin    : admin@vnvd.vn / admin123
```

> **Nếu báo lỗi "Table already exists":** Database đã tồn tại từ lần trước.  
> Chạy lệnh sau để xóa và tạo lại:
> ```sql
> mysql -u root -p -e "DROP DATABASE IF EXISTS website_vnpt;"
> ```
> Rồi chạy lại `npm run db:init`.

---

## ▶️ BƯỚC 6: KHỞI ĐỘNG BACKEND SERVER

```bash
npm start
```

**Kết quả thành công:**
```
✅ VNVD server đang chạy tại http://localhost:3000
✅ Đã kết nối MySQL: website_vnpt@localhost
```

> **Chế độ phát triển** (tự reload khi sửa code):
> ```bash
> npm run dev
> ```

---

## 🌐 BƯỚC 7: MỞ TRÌNH DUYỆT

Mở **Google Chrome**, **Firefox** hoặc **Edge**, truy cập:

```
http://localhost:3000
```

Website VNVD sẽ hiển thị với đầy đủ tính năng.

---

## 🔑 BƯỚC 8: ĐĂNG NHẬP ADMIN

1. Click nút **"Đăng nhập"** ở góc trên phải
2. Nhập thông tin:
   - **Email:** `admin@vnvd.vn`
   - **Mật khẩu:** `admin123`
3. Click **"Đăng nhập"**
4. Sau khi đăng nhập, click vào avatar → **"Quản trị hệ thống"** để vào Admin Dashboard

> **Tài khoản khách hàng:** Đăng ký mới qua nút "Đăng ký" trên website.

---

## 🔌 API ENDPOINTS (Tham khảo)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/health` | Kiểm tra server | Không |
| POST | `/api/auth/register` | Đăng ký | Không |
| POST | `/api/auth/login` | Đăng nhập | Không |
| GET | `/api/auth/me` | Thông tin tôi | JWT |
| GET | `/api/products` | Danh sách dịch vụ | Không |
| GET | `/api/cart` | Giỏ hàng | JWT (customer) |
| POST | `/api/cart` | Thêm vào giỏ | JWT (customer) |
| POST | `/api/orders` | Checkout | JWT (customer) |
| GET | `/api/admin/stats` | Thống kê | JWT (admin) |
| GET | `/api/admin/users` | Danh sách users | JWT (admin) |
| POST | `/api/chat` | Chatbot AI | Không |

---

## 🛠️ XỬ LÝ LỖI THƯỜNG GẶP

### ❌ Lỗi: "Cannot connect to MySQL" / "ECONNREFUSED"
**Nguyên nhân:** MySQL chưa chạy hoặc thông tin kết nối sai.  
**Cách sửa:**
```bash
# Windows: Mở Services → tìm MySQL → Start
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
```
Kiểm tra lại `DB_HOST`, `DB_USER`, `DB_PASSWORD` trong file `.env`.

---

### ❌ Lỗi: "Access denied for user"
**Nguyên nhân:** Sai mật khẩu hoặc user không có quyền.  
**Cách sửa:**
```sql
-- Đăng nhập MySQL bằng root, rồi chạy:
GRANT ALL PRIVILEGES ON website_vnpt.* TO 'vnvd_user'@'localhost';
FLUSH PRIVILEGES;
```

---

### ❌ Lỗi: "Port 3000 already in use"
**Nguyên nhân:** Cổng 3000 đang bị chiếm.  
**Cách sửa:** Đổi `PORT=3001` trong file `.env`, rồi truy cập `http://localhost:3001`.

---

### ❌ Lỗi: "Cannot find module"
**Nguyên nhân:** Chưa chạy `npm install`.  
**Cách sửa:** Chạy `npm install` trong thư mục dự án.

---

### ❌ Trang web hiển thị nhưng không đăng nhập được
**Nguyên nhân:** Database chưa có dữ liệu admin.  
**Cách sửa:** Chạy lại `npm run db:init`.

---

### ❌ Chatbot báo lỗi "Chưa được cấu hình GEMINI_API_KEY"
**Nguyên nhân:** Chưa thêm API key Gemini.  
**Cách sửa:**
1. Truy cập https://aistudio.google.com/apikey
2. Tạo API key miễn phí
3. Thêm vào `.env`: `GEMINI_API_KEY=your_key_here`
4. Khởi động lại server: `npm start`

---

## 📞 THÔNG TIN LIÊN HỆ

- **Hotline:** 1800 1260
- **Website:** http://localhost:3000 (sau khi chạy)
- **Admin demo:** admin@vnvd.vn / admin123

---

*Tài liệu này được tạo tự động. Phiên bản 2.1.0 — đã sửa tất cả lỗi nghiêm trọng.*
