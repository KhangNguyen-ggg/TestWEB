/**
 * routes/products.js — Sản phẩm / dịch vụ / gói bảng giá
 *   GET /api/products            Danh sách sản phẩm (kèm icon/color để khớp UI)
 *     ?type=dich_vu_so|combo     lọc theo loại
 *     ?category=1|2              lọc theo danh mục
 *   GET /api/products/:code       Chi tiết 1 sản phẩm theo ma_san_pham (vd svc-001)
 */
const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');
const { shapeProduct } = require('./shape');

const SELECT_COLS = `id, ma_san_pham, ten_san_pham, slug, danh_muc_id, loai_san_pham,
  thuong_hieu, mo_ta_ngan, gia_niem_yet, gia_khuyen_mai, don_vi_tinh, trang_thai`;

/* ---------- GET /api/products ---------- */
router.get('/', async (req, res) => {
  try {
    const where = [`trang_thai = 'dang_ban'`];
    const params = [];
    if (req.query.type) { where.push('loai_san_pham = ?'); params.push(req.query.type); }
    if (req.query.category) { where.push('danh_muc_id = ?'); params.push(Number(req.query.category)); }

    const [rows] = await pool.query(
      `SELECT ${SELECT_COLS} FROM san_pham WHERE ${where.join(' AND ')} ORDER BY danh_muc_id, id`,
      params
    );
    return res.json({ products: rows.map(shapeProduct) });
  } catch (err) {
    console.error('GET /api/products:', err);
    return res.status(500).json({ error: 'Không tải được danh sách sản phẩm.' });
  }
});

/* ---------- GET /api/products/:code ---------- */
router.get('/:code', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ${SELECT_COLS} FROM san_pham WHERE ma_san_pham = ? LIMIT 1`,
      [req.params.code]
    );
    if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
    return res.json({ product: shapeProduct(rows[0]) });
  } catch (err) {
    console.error('GET /api/products/:code:', err);
    return res.status(500).json({ error: 'Lỗi server.' });
  }
});

module.exports = router;
