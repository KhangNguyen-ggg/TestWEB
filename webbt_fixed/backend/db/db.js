/**
 * src/db.js
 * Tạo connection pool tới MySQL từ biến môi trường (.env).
 * Xuất `pool` (promise-based) để các route dùng chung.
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'website_vnpt',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  charset: 'utf8mb4',
  // Trả DECIMAL/BIGINT về dạng số JS khi an toàn (giá tiền < 2^53)
  decimalNumbers: true,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Kiểm tra kết nối DB khi khởi động. Không làm sập server nếu DB chưa sẵn sàng,
 * chỉ cảnh báo để lập trình viên biết cần import schema/seed và cấu hình .env.
 */
async function checkConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log(`✅ Đã kết nối MySQL: ${process.env.DB_NAME || 'website_vnpt'}@${process.env.DB_HOST || 'localhost'}`);
    return true;
  } catch (err) {
    console.warn('⚠️  Chưa kết nối được MySQL:', err.code || err.message);
    console.warn('    → Kiểm tra .env (DB_HOST/DB_USER/DB_PASSWORD/DB_NAME) và đã import db/schema.sql + db/seed.sql chưa.');
    return false;
  }
}

module.exports = { pool, checkConnection };
