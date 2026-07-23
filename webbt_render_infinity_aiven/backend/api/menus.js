/**
 * backend/api/menus.js — API lấy danh sách Menu
 * GET /api/menus
 */
const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menu WHERE trang_thai = 1 ORDER BY menu_cha_id, thu_tu ASC');
    return res.json({ status: 'success', data: rows });
  } catch (err) {
    console.error('GET /api/menus:', err);
    return res.status(500).json({ status: 'error', message: 'Lỗi server không lấy được menu' });
  }
});

module.exports = router;