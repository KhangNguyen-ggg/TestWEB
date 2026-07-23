require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const DB_NAME = process.env.DB_NAME || 'website_vnpt';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vnvd.vn';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
async function run() {
  const conn = await mysql.createConnection({host:process.env.DB_HOST||'localhost',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER||'root',password:process.env.DB_PASSWORD||'',multipleStatements:true,charset:'utf8mb4'});
  try {
    const safeDb=DB_NAME.replace(/`/g,'');
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${safeDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${safeDb}\``);
    const sqlPath=path.join(__dirname,'NewDB_vnpt.sql');
    console.log(`→ Đang import ${sqlPath} ...`);
    await conn.query(fs.readFileSync(sqlPath,'utf8'));
    const hash=await bcrypt.hash(ADMIN_PASSWORD,10);
    await conn.query(`INSERT INTO nhan_vien (ho_ten,email,mat_khau_hash,vai_tro_id,trang_thai) VALUES (?,?,?,1,'hoat_dong') ON DUPLICATE KEY UPDATE mat_khau_hash=VALUES(mat_khau_hash),vai_tro_id=1,trang_thai='hoat_dong'`,['Quản trị viên',ADMIN_EMAIL,hash]);
    console.log(`✅ CSDL ${DB_NAME} sẵn sàng. Admin: ${ADMIN_EMAIL}`);
  } catch(err){ console.error('❌ Lỗi khởi tạo CSDL:',err.message); process.exitCode=1; }
  finally{ await conn.end(); }
}
run();
