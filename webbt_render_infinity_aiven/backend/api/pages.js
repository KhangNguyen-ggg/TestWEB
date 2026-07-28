const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

router.get('/', async (req, res) => {
  try {
    const slug = req.query.slug || '';

    // Kiểm tra slug hợp lệ (chỉ cho phép chữ thường, số, dấu gạch ngang)
    if (!slug || !/^[a-z0-9\-]+$/.test(slug)) {
      return res.status(400).json({ status: 'error', message: 'Slug không hợp lệ' });
    }

    // Câu lệnh SQL JOIN giống hệt bên PHP
    const sql = `
      SELECT t.tieu_de, t.mo_ta, t.icon, t.ma_san_pham, s.gia_niem_yet
      FROM trang_tinh t
      LEFT JOIN san_pham s ON t.ma_san_pham = s.ma_san_pham
      WHERE t.slug = ?
    `;

    const [rows] = await pool.query(sql, [slug]);

    if (rows.length > 0) {
      const row = rows[0];
      return res.json({
        status: 'success',
        data: {
          title: row.tieu_de,
          subtitle: row.mo_ta,
          icon: row.icon,
          ma_san_pham: row.ma_san_pham,  // trả về để frontend biết có sản phẩm liên kết
          gia_niem_yet: row.gia_niem_yet // giá để hiển thị nút mua ngay
        }
      });
    } else {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy trang tĩnh này' });
    }
  } catch (err) {
    console.error('GET /api/pages:', err);
    return res.status(500).json({ status: 'error', message: 'Lỗi server' });
  }
});

module.exports = router;