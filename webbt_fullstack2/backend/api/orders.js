/**
 * routes/orders.js — Đơn hàng (checkout)
 *   POST /api/orders            Tạo đơn từ giỏ hàng hiện tại (yêu cầu đăng nhập khách hàng)
 *   GET  /api/orders            Danh sách đơn của tôi
 *   GET  /api/orders/:ma        Chi tiết 1 đơn (kèm dòng hàng)
 *
 * Checkout dùng transaction: tạo don_hang + don_hang_chi_tiet + lịch sử trạng thái,
 * sau đó dọn sạch giỏ hàng.
 */
const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth } = require('../auth-mw');

function customerOnly(req, res, next) {
  if (!req.user || req.user.loai !== 'customer') {
    return res.status(403).json({ error: 'Chỉ tài khoản khách hàng mới có thể đặt hàng.' });
  }
  next();
}

router.use(requireAuth, customerOnly);

function genOrderCode() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DH${ymd}${rand}`;
}

/* ---------- POST /api/orders (checkout) ---------- */
router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lấy giỏ hàng + dòng hàng
    const [carts] = await conn.query(
      'SELECT id FROM gio_hang WHERE khach_hang_id = ? ORDER BY id LIMIT 1',
      [req.user.id]
    );
    if (!carts.length) {
      await conn.rollback();
      return res.status(400).json({ error: 'Giỏ hàng trống.' });
    }
    const cartId = carts[0].id;

    const [lines] = await conn.query(
      `SELECT ct.san_pham_id, ct.so_luong, ct.don_gia_tai_thoi_diem, sp.ten_san_pham
         FROM gio_hang_chi_tiet ct JOIN san_pham sp ON sp.id = ct.san_pham_id
        WHERE ct.gio_hang_id = ?`,
      [cartId]
    );
    if (!lines.length) {
      await conn.rollback();
      return res.status(400).json({ error: 'Giỏ hàng trống.' });
    }

    const tongTienHang = lines.reduce((s, l) => s + Number(l.don_gia_tai_thoi_diem) * l.so_luong, 0);
    const giamGia = 0;
    const phiVanChuyen = 0;
    const tongThanhToan = tongTienHang - giamGia + phiVanChuyen;
    const maDon = genOrderCode();
    const ghiChu = (req.body && req.body.note) ? String(req.body.note).slice(0, 500) : null;

    // Tạo đơn
    const [orderRes] = await conn.query(
      `INSERT INTO don_hang
        (ma_don_hang, khach_hang_id, tong_tien_hang, phi_van_chuyen, giam_gia, tong_thanh_toan, trang_thai_don_hang, ghi_chu)
       VALUES (?, ?, ?, ?, ?, ?, 'cho_xac_nhan', ?)`,
      [maDon, req.user.id, tongTienHang, phiVanChuyen, giamGia, tongThanhToan, ghiChu]
    );
    const orderId = orderRes.insertId;

    // Dòng hàng (snapshot tên + đơn giá)
    for (const l of lines) {
      const thanhTien = Number(l.don_gia_tai_thoi_diem) * l.so_luong;
      await conn.query(
        `INSERT INTO don_hang_chi_tiet
          (don_hang_id, san_pham_id, ten_san_pham_snapshot, so_luong, don_gia, thanh_tien)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, l.san_pham_id, l.ten_san_pham, l.so_luong, l.don_gia_tai_thoi_diem, thanhTien]
      );
    }

    // Lịch sử trạng thái
    await conn.query(
      `INSERT INTO lich_su_trang_thai_don_hang (don_hang_id, trang_thai, ghi_chu) VALUES (?, 'cho_xac_nhan', 'Khách hàng đặt hàng')`,
      [orderId]
    );

    // Dọn giỏ
    await conn.query('DELETE FROM gio_hang_chi_tiet WHERE gio_hang_id = ?', [cartId]);

    await conn.commit();
    return res.status(201).json({
      order: { id: orderId, ma_don_hang: maDon, tong_thanh_toan: tongThanhToan, trang_thai: 'cho_xac_nhan', so_dong: lines.length },
    });
  } catch (err) {
    await conn.rollback();
    console.error('POST /api/orders:', err);
    return res.status(500).json({ error: 'Không tạo được đơn hàng. Vui lòng thử lại.' });
  } finally {
    conn.release();
  }
});

/* ---------- GET /api/orders (đơn của tôi) ---------- */
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT id, ma_don_hang, tong_thanh_toan, trang_thai_don_hang, created_at
         FROM don_hang WHERE khach_hang_id = ? ORDER BY id DESC`,
      [req.user.id]
    );
    return res.json({ orders });
  } catch (err) {
    console.error('GET /api/orders:', err);
    return res.status(500).json({ error: 'Không tải được đơn hàng.' });
  }
});

/* ---------- GET /api/orders/:ma ---------- */
router.get('/:ma', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT id, ma_don_hang, tong_tien_hang, phi_van_chuyen, giam_gia, tong_thanh_toan,
              trang_thai_don_hang, ghi_chu, created_at
         FROM don_hang WHERE ma_don_hang = ? AND khach_hang_id = ? LIMIT 1`,
      [req.params.ma, req.user.id]
    );
    if (!orders.length) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
    const [items] = await pool.query(
      `SELECT ten_san_pham_snapshot AS ten, so_luong, don_gia, thanh_tien
         FROM don_hang_chi_tiet WHERE don_hang_id = ?`,
      [orders[0].id]
    );
    return res.json({ order: orders[0], items });
  } catch (err) {
    console.error('GET /api/orders/:ma:', err);
    return res.status(500).json({ error: 'Lỗi server.' });
  }
});

module.exports = router;
