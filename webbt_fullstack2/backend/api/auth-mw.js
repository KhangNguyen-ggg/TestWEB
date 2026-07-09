/**
 * src/auth-mw.js
 * Middleware & helper cho xác thực JWT + băm mật khẩu.
 *
 * Token payload: { id, loai: 'customer'|'admin', role, email, ho_ten }
 * - loai='customer' → bản ghi trong bảng khach_hang
 * - loai='admin'    → bản ghi trong bảng nhan_vien (vai_tro admin)
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'vnvd_dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function hashPassword(plain) {
  return bcrypt.hash(String(plain), 10);
}
function comparePassword(plain, hash) {
  return bcrypt.compare(String(plain), String(hash || ''));
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Đọc Bearer token từ header Authorization. Không bắt buộc —
 * nếu không có token thì req.user = null và vẫn cho đi tiếp.
 */
function attachUser(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  req.user = null;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (_e) {
      req.user = null; // token hỏng/hết hạn → coi như chưa đăng nhập
    }
  }
  next();
}

/** Bắt buộc đã đăng nhập (customer hoặc admin). */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Bạn cần đăng nhập để thực hiện thao tác này.' });
  }
  next();
}

/** Bắt buộc là admin. */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Bạn không có quyền truy cập khu vực quản trị.' });
  }
  next();
}

module.exports = {
  JWT_SECRET,
  hashPassword,
  comparePassword,
  signToken,
  attachUser,
  requireAuth,
  requireAdmin,
};
