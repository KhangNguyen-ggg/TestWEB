/**
 * routes/admin.js — Khu vực quản trị (yêu cầu role admin)
 *   GET /api/admin/stats        Thống kê tổng quan (users, services, orders, revenue)
 *   GET /api/admin/users        Danh sách khách hàng
 *   GET /api/admin/products     Danh sách sản phẩm/dịch vụ
 *   GET /api/admin/orders       Danh sách đơn hàng (toàn hệ thống)
 */
const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');
const { requireAdmin } = require('./auth-mw');
const { shapeProduct, splitName } = require('./shape');

router.use(requireAdmin);

/* ---------- GET /api/admin/stats ---------- */
router.get('/stats', async (_req, res) => {
  try {
    const [[u]] = await pool.query('SELECT COUNT(*) AS n FROM khach_hang');
    const [[s]] = await pool.query(`SELECT COUNT(*) AS n FROM san_pham WHERE trang_thai = 'dang_ban'`);
    const [[o]] = await pool.query('SELECT COUNT(*) AS n FROM don_hang');
    const [[r]] = await pool.query(
      `SELECT COALESCE(SUM(tong_thanh_toan),0) AS total FROM don_hang WHERE trang_thai_don_hang <> 'da_huy'`
    );
    return res.json({
      stats: { users: u.n, services: s.n, orders: o.n, revenue: Number(r.total) },
    });
  } catch (err) {
    console.error('GET /api/admin/stats:', err);
    return res.status(500).json({ error: 'Không tải được thống kê.' });
  }
});

/* ---------- GET /api/admin/users ---------- */
router.get('/users', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, ho_ten, email, so_dien_thoai, trang_thai, created_at
         FROM khach_hang ORDER BY id DESC`
    );
    const users = rows.map((r) => {
      const { firstName, lastName } = splitName(r.ho_ten);
      return {
        id: r.id, firstName, lastName,
        email: r.email || '', phone: r.so_dien_thoai || '',
        role: 'customer', status: r.trang_thai, created_at: r.created_at,
      };
    });
    return res.json({ users });
  } catch (err) {
    console.error('GET /api/admin/users:', err);
    return res.status(500).json({ error: 'Không tải được danh sách người dùng.' });
  }
});

/* ---------- GET /api/admin/products ---------- */
router.get('/products', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, ma_san_pham, ten_san_pham, slug, danh_muc_id, loai_san_pham,
              thuong_hieu, mo_ta_ngan, gia_niem_yet, gia_khuyen_mai, don_vi_tinh, trang_thai
         FROM san_pham ORDER BY danh_muc_id, id`
    );
    return res.json({ products: rows.map(shapeProduct) });
  } catch (err) {
    console.error('GET /api/admin/products:', err);
    return res.status(500).json({ error: 'Không tải được danh sách sản phẩm.' });
  }
});

/* ---------- GET /api/admin/orders ---------- */
router.get('/orders', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT dh.id, dh.ma_don_hang, dh.tong_thanh_toan, dh.trang_thai_don_hang, dh.created_at,
              kh.ho_ten AS khach_hang, kh.email AS khach_email
         FROM don_hang dh JOIN khach_hang kh ON kh.id = dh.khach_hang_id
        ORDER BY dh.id DESC`
    );
    return res.json({ orders: rows });
  } catch (err) {
    console.error('GET /api/admin/orders:', err);
    return res.status(500).json({ error: 'Không tải được danh sách đơn hàng.' });
  }
});

module.exports = router;
