/**
 * src/init-db.js — Tiện ích khởi tạo cơ sở dữ liệu tự động cho Hosting
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Cập nhật DB_NAME mặc định thành tên DB trên InfinityFree
const DB_NAME = process.env.DB_NAME || 'if0_42294950_e_commerce'; 
const ADMIN_EMAIL = 'admin@vnvd.vn';
const ADMIN_PASSWORD = 'admin123';

async function run() {
  // Bổ sung thuộc tính 'database' để kết nối thẳng vào DB của shared hosting
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'sql203.infinityfree.com',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'if0_42294950',
    password: process.env.DB_PASSWORD || '',
    database: DB_NAME, 
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  try {
    console.log(`→ Đã kết nối thành công tới database: ${DB_NAME}`);
    
    console.log('→ Đang import db/schema.sql ...');
    const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    await conn.query(schema);

    console.log('→ Đang import db/seed.sql ...');
    const seed = fs.readFileSync(path.join(__dirname, '..', 'db', 'seed.sql'), 'utf8');
    await conn.query(seed);

    console.log('→ Đang tạo tài khoản admin demo (băm mật khẩu tại chỗ) ...');
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    // Đã bỏ dòng lệnh USE `DB_NAME` vì đã kết nối trực tiếp ở trên
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