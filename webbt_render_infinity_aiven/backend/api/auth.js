const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/db');

// ========================================================
// CẤU HÌNH
// ========================================================

// JWT Secret
const JWT_SECRET =
  process.env.JWT_SECRET || 'vnvd_super_secret_key_2026';

// Resend API Key
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Email gửi đi
const MAIL_FROM =
  process.env.MAIL_FROM || 'VNVD <onboarding@resend.dev>';

/* ========================================================
 * HÀM GỬI EMAIL CHÀO MỪNG
 * Sử dụng Resend API thay cho Gmail SMTP
 * ======================================================== */

async function sendWelcomeEmail(email, fullName) {
  try {
    console.log(
      `[Hệ thống] Đang tiến hành gửi email chào mừng tới địa chỉ: ${email}...`
    );

    // Kiểm tra API Key
    if (!RESEND_API_KEY) {
      console.error(
        '[Email] Chưa cấu hình RESEND_API_KEY.'
      );
      return false;
    }

    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: MAIL_FROM,
        to: [email],
        subject: '🎉 Chào mừng bạn đến với VNVD!',
        html: `
          <div style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: auto;
          ">

            <h2 style="color: #0056b3;">
              Xin chào ${fullName},
            </h2>

            <p>
              Cảm ơn bạn đã tin tưởng và tạo tài khoản
              tại <strong>VNVD</strong> bằng Google.
            </p>

            <p>
              Tài khoản của bạn đã được kích hoạt thành công.
              Ngay bây giờ, bạn có thể trải nghiệm toàn bộ
              các dịch vụ và tính năng trên hệ thống của chúng tôi.
            </p>

            <br>

            <p>
              Nếu cần hỗ trợ, đừng ngần ngại liên hệ lại với
              chúng tôi nhé!
            </p>

            <p>
              Trân trọng,<br>
              <strong>Đội ngũ VNVD</strong>
            </p>

          </div>
        `
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(
      `[Email] Đã gửi email chào mừng thành công tới: ${email}`
    );

    console.log(
      '[Email] Resend response:',
      response.data
    );

    return true;

  } catch (error) {

    console.error(
      '[Email] Lỗi gửi email chào mừng:'
    );

    if (error.response) {
      console.error(
        'Status:',
        error.response.status
      );

      console.error(
        'Data:',
        error.response.data
      );
    } else {
      console.error(
        error.message
      );
    }

    return false;
  }
}


/* ========================================================
 * 1. API ĐĂNG KÝ TÀI KHOẢN
 * Chỉ dành cho khách hàng
 * ======================================================== */

router.post('/register', async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      email,
      phone,
      password
    } = req.body;


    // Kiểm tra dữ liệu đầu vào
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        status: 'error',
        message:
          'Vui lòng nhập đủ thông tin bắt buộc'
      });

    }


    const hoTen =
      `${firstName.trim()} ${lastName.trim()}`;


    // Kiểm tra Email hoặc SĐT đã tồn tại
    const [existing] =
      await pool.query(
        `
        SELECT id
        FROM khach_hang
        WHERE email = ?
        OR so_dien_thoai = ?
        `,
        [
          email,
          phone || null
        ]
      );


    if (existing.length > 0) {

      return res.status(400).json({
        status: 'error',
        message:
          'Email hoặc Số điện thoại đã được sử dụng!'
      });

    }


    // Mã hóa mật khẩu
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );


    // Lưu database
    const [result] =
      await pool.query(
        `
        INSERT INTO khach_hang
        (
          ho_ten,
          email,
          so_dien_thoai,
          mat_khau_hash
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          hoTen,
          email,
          phone || null,
          hashedPassword
        ]
      );


    // Tạo JWT
    const token =
      jwt.sign(
        {
          id: result.insertId,
          email: email,
          name: hoTen,
          role: 'customer',
          loai: 'customer'
        },
        JWT_SECRET,
        {
          expiresIn: '1d'
        }
      );


    // Trả về Frontend
    return res.json({

      status: 'success',

      message:
        'Đăng ký tài khoản thành công!',

      token: token,

      user: {
        id: result.insertId,
        name: hoTen,
        email: email,
        role: 'customer'
      }

    });


  } catch (error) {

    console.error(
      'Lỗi Đăng ký:',
      error
    );

    return res.status(500).json({
      status: 'error',
      message: 'Lỗi máy chủ'
    });

  }

});


/* ========================================================
 * 2. API ĐĂNG NHẬP
 * Quét cả Admin và Khách hàng
 * ======================================================== */

router.post('/login', async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    if (!email || !password) {

      return res.status(400).json({
        status: 'error',
        message:
          'Vui lòng nhập Email và Mật khẩu'
      });

    }


    let user = null;
    let role = '';
    let tableName = '';


    // ====================================================
    // ƯU TIÊN 1: ADMIN / NHÂN VIÊN
    // ====================================================

    const [admins] =
      await pool.query(
        `
        SELECT *
        FROM nhan_vien
        WHERE email = ?
        LIMIT 1
        `,
        [email]
      );


    if (admins.length > 0) {

      user = admins[0];

      role =
        user.vai_tro_id === 1
          ? 'admin'
          : 'staff';

      tableName =
        'nhan_vien';

    }

    // ====================================================
    // ƯU TIÊN 2: KHÁCH HÀNG
    // ====================================================

    else {

      const [customers] =
        await pool.query(
          `
          SELECT *
          FROM khach_hang
          WHERE email = ?
          LIMIT 1
          `,
          [email]
        );


      if (customers.length > 0) {

        user = customers[0];

        role =
          'customer';

        tableName =
          'khach_hang';

      }

    }


    // Không tìm thấy user
    if (!user) {

      return res.status(401).json({
        status: 'error',
        message:
          'Tài khoản không tồn tại!'
      });

    }


    // ====================================================
    // KIỂM TRA TÀI KHOẢN GOOGLE
    // ====================================================

    if (!user.mat_khau_hash) {

      return res.status(401).json({
        status: 'error',
        message:
          'Tài khoản này được đăng nhập bằng Google. Vui lòng chọn Đăng nhập bằng Google.'
      });

    }


    // Kiểm tra mật khẩu
    const isMatch =
      await bcrypt.compare(
        password,
        user.mat_khau_hash
      );


    if (!isMatch) {

      return res.status(401).json({
        status: 'error',
        message:
          'Mật khẩu không chính xác!'
      });

    }


    // ====================================================
    // TẠO JWT
    // ====================================================

    const token =
      jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.ho_ten,
          role: role,
          loai: role
        },
        JWT_SECRET,
        {
          expiresIn: '1d'
        }
      );


    // Trả kết quả
    return res.json({

      status: 'success',

      message:
        'Đăng nhập thành công',

      token: token,

      user: {
        id: user.id,
        name: user.ho_ten,
        email: user.email,
        role: role
      }

    });


  } catch (error) {

    console.error(
      'Lỗi Đăng nhập:',
      error
    );

    return res.status(500).json({
      status: 'error',
      message:
        'Lỗi máy chủ'
    });

  }

});


/* ========================================================
 * 3. API KIỂM TRA PHIÊN ĐĂNG NHẬP
 * Dành cho F5 reload
 * ======================================================== */

router.get('/me', (req, res) => {

  // req.user được attach từ middleware
  if (!req.user) {

    return res.status(401).json({

      status: 'error',

      message:
        'Token không hợp lệ hoặc đã hết hạn.'

    });

  }


  return res.json({

    status: 'success',

    user: {

      id: req.user.id,

      name:
        req.user.name ||
        req.user.ho_ten,

      email:
        req.user.email,

      role:
        req.user.role

    }

  });

});


/* ========================================================
 * 4. ĐĂNG NHẬP BẰNG GOOGLE
 * OAuth2
 * ======================================================== */

router.post('/google', async (req, res) => {

  const {
    token
  } = req.body;


  if (!token) {

    return res.status(400).json({

      error:
        'Không tìm thấy token xác thực.'

    });

  }


  try {

    // ====================================================
    // LẤY THÔNG TIN USER TỪ GOOGLE
    // ====================================================

    const googleResponse =
      await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
      );


    const userInfo =
      googleResponse.data;


    const email =
      userInfo.email;


    const fullName =
      `${userInfo.given_name || ''} ${userInfo.family_name || ''}`
        .trim();


    // ====================================================
    // TÌM USER TRONG DATABASE
    // ====================================================

    const [users] =
      await pool.query(
        `
        SELECT *
        FROM khach_hang
        WHERE email = ?
        `,
        [email]
      );


    let user =
      users[0];


    // ====================================================
    // NẾU CHƯA CÓ USER
    // → TẠO TÀI KHOẢN
    // → GỬI EMAIL CHÀO MỪNG
    // ====================================================

    if (!user) {

      const insertQuery = `
        INSERT INTO khach_hang
        (
          ho_ten,
          email,
          mat_khau_hash,
          trang_thai,
          da_xac_thuc_email
        )
        VALUES
        (
          ?,
          ?,
          NULL,
          'hoat_dong',
          1
        )
      `;


      const [result] =
        await pool.query(
          insertQuery,
          [
            fullName,
            email
          ]
        );


      user = {

        id:
          result.insertId,

        name:
          fullName,

        email:
          email,

        role:
          'customer'

      };


      // ==================================================
      // GỬI EMAIL CHÀO MỪNG
      // ==================================================

      await sendWelcomeEmail(
        email,
        fullName
      );

    }


    // ====================================================
    // USER ĐÃ TỒN TẠI
    // ====================================================

    else {

      user = {

        id:
          user.id,

        name:
          user.ho_ten,

        email:
          user.email,

        role:
          user.vai_tro ||
          'customer'

      };

    }


    // ====================================================
    // TẠO JWT CHO GOOGLE LOGIN
    // ====================================================

    const jwtToken =
      jwt.sign(
        {
          id:
            user.id,

          email:
            user.email,

          name:
            user.name,

          role:
            user.role,

          loai:
            user.role

        },
        JWT_SECRET,
        {
          expiresIn:
            '1d'
        }
      );


    // ====================================================
    // TRẢ KẾT QUẢ CHO FRONTEND
    // ====================================================

    return res.status(200).json({

      status:
        'success',

      message:
        'Đăng nhập Google thành công',

      token:
        jwtToken,

      user:
        user

    });


  } catch (error) {

    console.error(
      'Lỗi đăng nhập Google:',
      error
    );

    return res.status(500).json({

      status:
        'error',

      error:
        'Xác thực thất bại.'

    });

  }

});


module.exports = router;