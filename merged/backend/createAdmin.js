const { pool } = require('./db/db.js');
const { hashPassword } = require('./api/auth-mw.js');

async function createAdmin() {
  try {
    console.log('⏳ Đang tạo tài khoản Admin...');
    
    const email = 'admin_chuan@vnvd.vn';
    const password = 'password123';
    
    // Gọi trực tiếp hàm hashPassword từ middleware của bạn để đảm bảo chuẩn mã hóa
    const hash = await hashPassword(password);

    // Chèn vào bảng nhan_vien (đảm bảo vai_tro_id = 1 là admin)
    const [result] = await pool.query(
      `INSERT INTO nhan_vien (ho_ten, email, mat_khau_hash, vai_tro_id, trang_thai) 
       VALUES (?, ?, ?, 1, 'hoat_dong')`,
      ['Quản Trị Viên Hệ Thống', email, hash]
    );

    console.log('✅ Đã tạo tài khoản Admin thành công!');
    console.log(`✉️  Email: ${email}`);
    console.log(`🔑 Mật khẩu: ${password}`);
    process.exit(0); // Thoát script sau khi xong
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
        console.log('⚠️ Email Admin này đã tồn tại trong Database!');
    } else {
        console.error('❌ Lỗi hệ thống:', err);
    }
    process.exit(1);
  }
}

createAdmin();