/**
 * routes/auth.js — Xác thực & phân quyền
 *   POST /api/auth/register  Đăng ký khách hàng (khach_hang)
 *   POST /api/auth/login     Đăng nhập (admin từ nhan_vien, customer từ khach_hang)
 *   GET  /api/auth/me        Lấy thông tin người đang đăng nhập (theo JWT)
 */
const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { hashPassword, comparePassword, signToken, requireAuth } = require('../auth-mw');
const { shapeCustomer, shapeAdmin, joinName } = require('../shape');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- POST /api/auth/register ---------- */
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body || {};
    if (!firstName || !String(firstName).trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập họ.' });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ.' });
    }
    if (!password || String(password).length < 8) {
      return res.status(400).json({ error: 'Mật khẩu tối thiểu 8 ký tự.' });
    }

    // Email đã tồn tại?
    const [dup] = await pool.query('SELECT id FROM khach_hang WHERE email = ? LIMIT 1', [email]);
    if (dup.length) {
      return res.status(409).json({ error: 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.' });
    }

    const hash = await hashPassword(password);
    const hoTen = joinName(firstName, lastName);
    const [result] = await pool.query(
      `INSERT INTO khach_hang (ho_ten, email, so_dien_thoai, mat_khau_hash, trang_thai, da_xac_thuc_email)
       VALUES (?, ?, ?, ?, 'hoat_dong', TRUE)`,
      [hoTen, email, phone || null, hash]
    );

    const user = {
      id: result.insertId,
      firstName: String(firstName).trim(),
      lastName: String(lastName || '').trim(),
      email,
      phone: phone || '',
      role: 'customer',
    };
    const token = signToken({ id: user.id, loai: 'customer', role: 'customer', email, ho_ten: hoTen });
    return res.status(201).json({ token, user });
  } catch (err) {
    // Xử lý trùng số điện thoại (UNIQUE) rõ ràng
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email hoặc số điện thoại đã tồn tại.' });
    }
    console.error('POST /api/auth/register:', err);
    return res.status(500).json({ error: 'Lỗi server khi đăng ký. Vui lòng thử lại.' });
  }
});

/* ---------- POST /api/auth/login ---------- */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Vui lòng nhập mật khẩu.' });
    }

    // 1) Thử tài khoản NHÂN VIÊN (admin) trước
    const [admins] = await pool.query(
      `SELECT nv.id, nv.ho_ten, nv.email, nv.mat_khau_hash, nv.trang_thai, vt.ten_vai_tro
         FROM nhan_vien nv JOIN vai_tro vt ON vt.id = nv.vai_tro_id
        WHERE nv.email = ? LIMIT 1`,
      [email]
    );
    if (admins.length) {
      const row = admins[0];
      if (row.trang_thai !== 'hoat_dong') {
        return res.status(403).json({ error: 'Tài khoản đã bị khóa.' });
      }
      const ok = await comparePassword(password, row.mat_khau_hash);
      if (!ok) return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
      const user = shapeAdmin(row);
      const token = signToken({ id: user.id, loai: 'admin', role: 'admin', email: user.email, ho_ten: row.ho_ten });
      return res.json({ token, user });
    }

    // 2) Tài khoản KHÁCH HÀNG
    const [customers] = await pool.query(
      `SELECT id, ho_ten, email, so_dien_thoai, mat_khau_hash, trang_thai
         FROM khach_hang WHERE email = ? LIMIT 1`,
      [email]
    );
    if (!customers.length) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
    }
    const c = customers[0];
    if (c.trang_thai === 'khoa') {
      return res.status(403).json({ error: 'Tài khoản đã bị khóa.' });
    }
    const ok = await comparePassword(password, c.mat_khau_hash);
    if (!ok) return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });

    const user = shapeCustomer(c);
    const token = signToken({ id: user.id, loai: 'customer', role: 'customer', email: user.email, ho_ten: c.ho_ten });
    return res.json({ token, user });
  } catch (err) {
    console.error('POST /api/auth/login:', err);
    return res.status(500).json({ error: 'Lỗi server khi đăng nhập. Vui lòng thử lại.' });
  }
});

/* ---------- GET /api/auth/me ---------- */
router.get('/me', requireAuth, async (req, res) => {
  try {
    if (req.user.loai === 'admin') {
      const [rows] = await pool.query('SELECT id, ho_ten, email FROM nhan_vien WHERE id = ? LIMIT 1', [req.user.id]);
      if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy tài khoản.' });
      return res.json({ user: shapeAdmin(rows[0]) });
    }
    const [rows] = await pool.query(
      'SELECT id, ho_ten, email, so_dien_thoai FROM khach_hang WHERE id = ? LIMIT 1',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy tài khoản.' });
    return res.json({ user: shapeCustomer(rows[0]) });
  } catch (err) {
    console.error('GET /api/auth/me:', err);
    return res.status(500).json({ error: 'Lỗi server.' });
  }
});

module.exports = router;
