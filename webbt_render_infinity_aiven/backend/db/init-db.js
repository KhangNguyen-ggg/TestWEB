/**
 * src/init-db.js — Tiện ích khởi tạo cơ sở dữ liệu tự động.
 *
 *   node src/init-db.js
 *
 * Việc nó làm:
 *   1) Kết nối MySQL (KHÔNG chọn sẵn database) bằng cấu hình .env.
 *   2) Chạy db/init_all.sql (Chứa toàn bộ cấu trúc bảng và dữ liệu mẫu).
 *   3) Tạo/ghi đè tài khoản admin demo với mật khẩu băm bcrypt sinh tại chỗ
 *      (an toàn hơn hash hardcode) — email admin@vnvd.vn / mật khẩu admin123.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_NAME = process.env.DB_NAME || 'website_vnpt';
const ADMIN_EMAIL = 'admin@vnvd.vn';
const ADMIN_PASSWORD = 'admin123';

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  try {
    // 1. Đọc và thực thi file SQL hợp nhất mới
    console.log('→ Đang thực thi file cấu trúc và dữ liệu db/init_all.sql ...');
    const initSql = fs.readFileSync(path.join(__dirname, '..', 'db', 'init_all.sql'), 'utf8');
    await conn.query(initSql);

    // 2. Tạo/Cập nhật tài khoản admin demo bảo mật
    console.log('→ Đang tạo tài khoản admin demo (băm mật khẩu tại chỗ) ...');
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await conn.query(`USE \`${DB_NAME}\`;`);
    await conn.query(
      `INSERT INTO nhan_vien (ho_ten, email, mat_khau_hash, vai_tro_id, trang_thai)
       VALUES ('Quản trị viên', ?, ?, 1, 'hoat_dong')
       ON DUPLICATE KEY UPDATE mat_khau_hash = VALUES(mat_khau_hash), trang_thai = 'hoat_dong'`,
      [ADMIN_EMAIL, hash]
    );

    console.log('\n✅ Khởi tạo CSDL hoàn tất.');
    console.log(`   Database : ${DB_NAME}`);
    console.log(`   Admin    : ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } catch (err) {
    console.error('\n❌ Lỗi khởi tạo CSDL:', err.message);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

run();