/**
 * routes/cart.js — Giỏ hàng (yêu cầu đăng nhập khách hàng)
 *   GET    /api/cart            Lấy giỏ hàng hiện tại
 *   POST   /api/cart            Thêm sản phẩm { code, qty? }  (code = ma_san_pham)
 *   PUT    /api/cart/:code      Cập nhật số lượng { qty }
 *   DELETE /api/cart/:code      Xóa 1 dòng
 *   DELETE /api/cart            Xóa toàn bộ giỏ
 *
 * Trả về item theo đúng shape frontend đang dùng: { id, name, price, icon, color, qty }.
 */
const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth } = require('../auth-mw');
const { PRODUCT_META } = require('../shape');

// Chỉ khách hàng mới có giỏ hàng cá nhân
function customerOnly(req, res, next) {
  if (!req.user || req.user.loai !== 'customer') {
    return res.status(403).json({ error: 'Chỉ tài khoản khách hàng mới có giỏ hàng.' });
  }
  next();
}

// Lấy (hoặc tạo) giỏ hàng của khách hàng, trả về gio_hang_id
async function getOrCreateCart(khachHangId) {
  const [rows] = await pool.query(
    'SELECT id FROM gio_hang WHERE khach_hang_id = ? ORDER BY id LIMIT 1',
    [khachHangId]
  );
  if (rows.length) return rows[0].id;
  const [r] = await pool.query('INSERT INTO gio_hang (khach_hang_id) VALUES (?)', [khachHangId]);
  return r.insertId;
}

// Đọc toàn bộ dòng giỏ + join sản phẩm -> shape frontend
async function readCartItems(gioHangId) {
  const [rows] = await pool.query(
    `SELECT ct.san_pham_id, ct.so_luong, ct.don_gia_tai_thoi_diem,
            sp.ma_san_pham, sp.ten_san_pham
       FROM gio_hang_chi_tiet ct
       JOIN san_pham sp ON sp.id = ct.san_pham_id
      WHERE ct.gio_hang_id = ?
      ORDER BY ct.id`,
    [gioHangId]
  );
  return rows.map((r) => {
    const meta = PRODUCT_META[r.ma_san_pham] || { icon: 'box', color: '#0066CC' };
    return {
      id: r.ma_san_pham,
      name: r.ten_san_pham,
      price: Number(r.don_gia_tai_thoi_diem),
      icon: meta.icon,
      color: meta.color,
      qty: r.so_luong,
    };
  });
}

// Tra sản phẩm theo ma_san_pham
async function findProduct(code) {
  const [rows] = await pool.query(
    `SELECT id, ma_san_pham, ten_san_pham, gia_niem_yet, gia_khuyen_mai
       FROM san_pham WHERE ma_san_pham = ? AND trang_thai = 'dang_ban' LIMIT 1`,
    [code]
  );
  return rows[0] || null;
}

router.use(requireAuth, customerOnly);

/* ---------- GET /api/cart ---------- */
router.get('/', async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);
    return res.json({ items: await readCartItems(cartId) });
  } catch (err) {
    console.error('GET /api/cart:', err);
    return res.status(500).json({ error: 'Không tải được giỏ hàng.' });
  }
});

/* ---------- POST /api/cart  (thêm / +qty) ---------- */
router.post('/', async (req, res) => {
  try {
    const { code, qty } = req.body || {};
    const addQty = Math.max(1, parseInt(qty, 10) || 1);
    const product = await findProduct(code);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });

    const cartId = await getOrCreateCart(req.user.id);
    const price = product.gia_khuyen_mai != null ? Number(product.gia_khuyen_mai) : Number(product.gia_niem_yet);

    const [existing] = await pool.query(
      'SELECT id, so_luong FROM gio_hang_chi_tiet WHERE gio_hang_id = ? AND san_pham_id = ? LIMIT 1',
      [cartId, product.id]
    );
    if (existing.length) {
      await pool.query('UPDATE gio_hang_chi_tiet SET so_luong = so_luong + ? WHERE id = ?', [addQty, existing[0].id]);
    } else {
      await pool.query(
        'INSERT INTO gio_hang_chi_tiet (gio_hang_id, san_pham_id, so_luong, don_gia_tai_thoi_diem) VALUES (?, ?, ?, ?)',
        [cartId, product.id, addQty, price]
      );
    }
    return res.status(201).json({ items: await readCartItems(cartId) });
  } catch (err) {
    console.error('POST /api/cart:', err);
    return res.status(500).json({ error: 'Không thêm được vào giỏ hàng.' });
  }
});

/* ---------- PUT /api/cart/:code  (đặt số lượng tuyệt đối) ---------- */
router.put('/:code', async (req, res) => {
  try {
    const qty = parseInt(req.body?.qty, 10);
    const product = await findProduct(req.params.code);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });
    const cartId = await getOrCreateCart(req.user.id);

    if (!qty || qty <= 0) {
      await pool.query('DELETE FROM gio_hang_chi_tiet WHERE gio_hang_id = ? AND san_pham_id = ?', [cartId, product.id]);
    } else {
      const [existing] = await pool.query(
        'SELECT id FROM gio_hang_chi_tiet WHERE gio_hang_id = ? AND san_pham_id = ? LIMIT 1',
        [cartId, product.id]
      );
      if (existing.length) {
        await pool.query('UPDATE gio_hang_chi_tiet SET so_luong = ? WHERE id = ?', [qty, existing[0].id]);
      } else {
        const price = product.gia_khuyen_mai != null ? Number(product.gia_khuyen_mai) : Number(product.gia_niem_yet);
        await pool.query(
          'INSERT INTO gio_hang_chi_tiet (gio_hang_id, san_pham_id, so_luong, don_gia_tai_thoi_diem) VALUES (?, ?, ?, ?)',
          [cartId, product.id, qty, price]
        );
      }
    }
    return res.json({ items: await readCartItems(cartId) });
  } catch (err) {
    console.error('PUT /api/cart/:code:', err);
    return res.status(500).json({ error: 'Không cập nhật được giỏ hàng.' });
  }
});

/* ---------- DELETE /api/cart/:code ---------- */
router.delete('/:code', async (req, res) => {
  try {
    const product = await findProduct(req.params.code);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });
    const cartId = await getOrCreateCart(req.user.id);
    await pool.query('DELETE FROM gio_hang_chi_tiet WHERE gio_hang_id = ? AND san_pham_id = ?', [cartId, product.id]);
    return res.json({ items: await readCartItems(cartId) });
  } catch (err) {
    console.error('DELETE /api/cart/:code:', err);
    return res.status(500).json({ error: 'Không xóa được sản phẩm khỏi giỏ.' });
  }
});

/* ---------- DELETE /api/cart  (xóa toàn bộ) ---------- */
router.delete('/', async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);
    await pool.query('DELETE FROM gio_hang_chi_tiet WHERE gio_hang_id = ?', [cartId]);
    return res.json({ items: [] });
  } catch (err) {
    console.error('DELETE /api/cart:', err);
    return res.status(500).json({ error: 'Không xóa được giỏ hàng.' });
  }
});

module.exports = router;
