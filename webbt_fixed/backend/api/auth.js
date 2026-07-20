const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/db');

// Khóa bí mật để tạo Token (Trong thực tế nên để trong file .env)
const JWT_SECRET = process.env.JWT_SECRET || 'vnvd_super_secret_key_2026';

/* ========================================================
 * 1. API ĐĂNG KÝ TÀI KHOẢN (Chỉ dành cho khách hàng)
 * ======================================================== */
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Vui lòng nhập đủ thông tin bắt buộc' });
    }

    const hoTen = `${firstName.trim()} ${lastName.trim()}`;

    // Kiểm tra xem Email hoặc SĐT đã tồn tại chưa
    const [existing] = await pool.query(
      "SELECT id FROM khach_hang WHERE email = ? OR so_dien_thoai = ?",
      [email, phone || null]
    );

    if (existing.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Email hoặc Số điện thoại đã được sử dụng!' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lưu vào database
    const [result] = await pool.query(
      "INSERT INTO khach_hang (ho_ten, email, so_dien_thoai, mat_khau_hash) VALUES (?, ?, ?, ?)",
      [hoTen, email, phone || null, hashedPassword]
    );

    // THÊM MỚI: Tạo mã Token (JWT) định danh người dùng từ ID vừa được insert
    const token = jwt.sign(
      { id: result.insertId, email: email, name: hoTen, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // CẬP NHẬT: Trả về kết quả kèm theo token và thông tin user cho Frontend
    return res.json({ 
      status: 'success', 
      message: 'Đăng ký tài khoản thành công!',
      token: token,
      user: { id: result.insertId, name: hoTen, email: email, role: 'customer' }
    });


  } catch (error) {
    console.error('Lỗi Đăng ký:', error);
    return res.status(500).json({ status: 'error', message: 'Lỗi máy chủ' });
  }
});

/* ========================================================
 * 2. API ĐĂNG NHẬP (Quét cả Admin và Khách hàng)
 * ======================================================== */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Vui lòng nhập Email và Mật khẩu' });
    }

    let user = null;
    let role = '';
    let tableName = '';

    // Ưu tiên 1: Tìm trong bảng Nhân viên (Admin) trước
    const [admins] = await pool.query("SELECT * FROM nhan_vien WHERE email = ? LIMIT 1", [email]);

    if (admins.length > 0) {
      user = admins[0];
      role = user.vai_tro_id === 1 ? 'admin' : 'staff';
      tableName = 'nhan_vien';
    } else {
      // Ưu tiên 2: Không thấy Admin thì tìm trong bảng Khách hàng
      const [customers] = await pool.query("SELECT * FROM khach_hang WHERE email = ? LIMIT 1", [email]);
      if (customers.length > 0) {
        user = customers[0];
        role = 'customer';
        tableName = 'khach_hang';
      }
    }

    // Nếu không tìm thấy ở cả 2 bảng
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Tài khoản không tồn tại!' });
    }

    // Kiểm tra mật khẩu (So sánh pass nhập vào với mã hash trong DB)
    const isMatch = await bcrypt.compare(password, user.mat_khau_hash);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Mật khẩu không chính xác!' });
    }

    // Cập nhật thời gian đăng nhập lần cuối (Sử dụng lệnh NOW() của MySQL)
    //await pool.query(`UPDATE ${tableName} SET lan_dang_nhap_cuoi = NOW() WHERE id = ?`, [user.id]);

    // Tạo mã Token (JWT) định danh người dùng
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.ho_ten, role: role },
      JWT_SECRET,
      { expiresIn: '1d' } // Token có hiệu lực trong 1 ngày
    );

    // Trả kết quả về cho Frontend
    return res.json({
      status: 'success',
      message: 'Đăng nhập thành công',
      token: token,
      user: { id: user.id, name: user.ho_ten, email: user.email, role: role }
    });

  } catch (error) {
    console.error('Lỗi Đăng nhập:', error);
    return res.status(500).json({ status: 'error', message: 'Lỗi máy chủ' });
  }
});

module.exports = router;