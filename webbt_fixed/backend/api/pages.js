const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

router.get('/', async (req, res) => {
  try {
    const slug = req.query.slug || '';
    
    // Kiểm tra tính hợp lệ của slug (giống hệt code PHP cũ)
    if (!slug || !/^[a-z0-9\-]+$/.test(slug)) {
      return res.status(400).json({ status: 'error', message: 'Slug không hợp lệ' });
    }

    // Truy vấn cơ sở dữ liệu
    const [rows] = await pool.query(
      "SELECT tieu_de, mo_ta, icon FROM trang_tinh WHERE slug = ? LIMIT 1",
      [slug]
    );

    // Trả về kết quả
    if (rows.length > 0) {
      return res.json({
        status: 'success',
        data: {
          title: rows[0].tieu_de,
          subtitle: rows[0].mo_ta,
          icon: rows[0].icon,
        }
      });
    } else {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy trang' });
    }
  } catch (err) {
    console.error('GET /api/pages:', err);
    return res.status(500).json({ status: 'error', message: 'Lỗi server' });
  }
});

module.exports = router;