# Hướng dẫn deploy bản gộp VNVD

## Kiến trúc khuyến nghị
- Nginx: HTTPS, phục vụ frontend PHP và proxy `/api/` tới Node.js.
- PHP-FPM: chạy `frontend/index.php`.
- Node.js/Express: chạy `backend/server.js` tại `127.0.0.1:3000`.
- MySQL: cloud hoặc VM.
- PM2: giữ Node.js chạy nền.

## `.env` ở thư mục gốc
```env
DB_HOST=...
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=website_vnpt
DB_CONNECTION_LIMIT=10
JWT_SECRET=chuoi-ngau-nhien-dai
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-flash-latest
PORT=3000
ADMIN_EMAIL=admin@vnvd.vn
ADMIN_PASSWORD=doi-mat-khau-ngay
API_URL=http://127.0.0.1:3000
```

## Cài đặt
```bash
npm ci
npm run db:init
npm start
```

## Kiểm tra
`GET /api/health` phải trả `{"ok":true}`.

## Lưu ý
- Node.js/Express không thực thi PHP. Frontend PHP phải chạy qua PHP-FPM/Apache.
- JavaScript đã chuyển API về same-origin `/api/...`.
- PHP server-side dùng `API_URL`, mặc định `http://127.0.0.1:3000`.
- `admin_panel/` là phần PHP cũ, giữ lại nhưng không phải Node API.
- Không commit `.env`. Nếu key DB/Gemini từng bị đưa lên GitHub, phải thu hồi và tạo key mới.
