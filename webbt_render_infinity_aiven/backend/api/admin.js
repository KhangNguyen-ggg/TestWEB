/**
 * routes/admin.js — Khu vực quản trị (yêu cầu role admin)
 * Hỗ trợ Giao diện Admin Panel gọi API (Client-side Rendering)
 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Yêu cầu cài đặt: npm install bcryptjs
const { pool } = require('../db/db');
const { requireAdmin } = require('./auth-mw');
const { shapeProduct, splitName } = require('./shape');

// Bắt buộc tất cả các route bên dưới phải có quyền Admin
router.use(requireAdmin);

/* ==========================================================
   1. API DASHBOARD (THỐNG KÊ TỔNG QUAN)
   Đã cập nhật để trả về đúng các biến mà file index.php cần
   ========================================================== */
router.get('/stats', async (_req, res) => {
    try {
        // Thống kê Quản trị viên (Thay 'admins' bằng 'nhan_vien' nếu DB của bạn dùng tên đó)
        const [[{ totalAdmins }]] = await pool.query('SELECT COUNT(*) as totalAdmins FROM admins');
        const [[{ activeAdmins }]] = await pool.query('SELECT COUNT(*) as activeAdmins FROM admins WHERE trang_thai="hoat_dong"');

        // Thống kê Khách hàng
        const [[{ totalCustomers }]] = await pool.query('SELECT COUNT(*) as totalCustomers FROM khach_hang');
        const [[{ activeCustomers }]] = await pool.query('SELECT COUNT(*) as activeCustomers FROM khach_hang WHERE trang_thai="hoat_dong"');
        const [[{ lockedCustomers }]] = await pool.query('SELECT COUNT(*) as lockedCustomers FROM khach_hang WHERE trang_thai="khoa"');
        const [[{ newThisMonth }]] = await pool.query('SELECT COUNT(*) as newThisMonth FROM khach_hang WHERE MONTH(created_at)=MONTH(NOW()) AND YEAR(created_at)=YEAR(NOW())');

        // Khách hàng mới nhất
        const [latestCustomers] = await pool.query('SELECT ho_ten, email, trang_thai, created_at FROM khach_hang ORDER BY created_at DESC LIMIT 5');

        // (Giữ lại của bạn) Tổng doanh thu và Đơn hàng
        const [[o]] = await pool.query('SELECT COUNT(*) AS n FROM don_hang');
        const [[r]] = await pool.query(`SELECT COALESCE(SUM(tong_thanh_toan),0) AS total FROM don_hang WHERE trang_thai_don_hang <> 'da_huy'`);

        return res.json({
            // Số liệu cho bản đồ mới
            totalAdmins, activeAdmins,
            totalCustomers, activeCustomers, lockedCustomers, newThisMonth,
            latestCustomers,
            // Số liệu cũ giữ lại đề phòng dùng ở nơi khác
            orders: o.n, revenue: Number(r.total)
        });
    } catch (err) {
        console.error('GET /api/admin/stats:', err);
        return res.status(500).json({ error: 'Không tải được thống kê.' });
    }
});


/* ==========================================================
   2. API QUẢN TRỊ VIÊN (BẢNG ADMINS / NHAN_VIEN)
   ========================================================== */
// Lấy danh sách
router.get('/users', async (req, res) => {
    try {
        const { q = '', role = '', status = '' } = req.query;
        let sql = 'SELECT id, ho_ten, email, vai_tro, trang_thai, created_at FROM admins WHERE 1=1';
        const params = [];

        if (q) {
            sql += ' AND (ho_ten LIKE ? OR email LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }
        if (role) {
            sql += ' AND vai_tro = ?';
            params.push(role);
        }
        if (status) {
            sql += ' AND trang_thai = ?';
            params.push(status);
        }
        sql += ' ORDER BY id DESC';

        const [users] = await pool.query(sql, params);
        
        const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM admins');
        const [[{ active }]] = await pool.query('SELECT COUNT(*) as active FROM admins WHERE trang_thai="hoat_dong"');
        const [[{ locked }]] = await pool.query('SELECT COUNT(*) as locked FROM admins WHERE trang_thai="khoa"');

        return res.json({ users, stats: { total, active, locked } });
    } catch (err) {
        console.error('GET /api/admin/users:', err);
        return res.status(500).json({ error: 'Lỗi lấy danh sách Admin' });
    }
});

// Thêm Admin
router.post('/users', async (req, res) => {
    const { ho_ten, email, mat_khau, vai_tro, trang_thai } = req.body;
    try {
        const hash = await bcrypt.hash(mat_khau, 10);
        await pool.query(
            'INSERT INTO admins (ho_ten, email, mat_khau, vai_tro, trang_thai) VALUES (?, ?, ?, ?, ?)',
            [ho_ten, email, hash, vai_tro || 'admin', trang_thai || 'hoat_dong']
        );
        return res.status(201).json({ message: 'Thêm Admin thành công' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email đã tồn tại!' });
        return res.status(500).json({ error: 'Lỗi thêm Admin' });
    }
});

// Sửa Admin
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { ho_ten, email, mat_khau, vai_tro, trang_thai } = req.body;
    try {
        if (mat_khau) {
            const hash = await bcrypt.hash(mat_khau, 10);
            await pool.query(
                'UPDATE admins SET ho_ten=?, email=?, mat_khau=?, vai_tro=?, trang_thai=? WHERE id=?',
                [ho_ten, email, hash, vai_tro, trang_thai, id]
            );
        } else {
            await pool.query(
                'UPDATE admins SET ho_ten=?, email=?, vai_tro=?, trang_thai=? WHERE id=?',
                [ho_ten, email, vai_tro, trang_thai, id]
            );
        }
        return res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi cập nhật Admin' });
    }
});

// Xóa Admin
router.delete('/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM admins WHERE id = ?', [req.params.id]);
        return res.json({ message: 'Đã xóa Admin' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi xóa Admin' });
    }
});

// Đổi trạng thái Admin
router.patch('/users/:id/status', async (req, res) => {
    try {
        await pool.query('UPDATE admins SET trang_thai=? WHERE id=?', [req.body.trang_thai, req.params.id]);
        return res.json({ message: 'Đổi trạng thái thành công' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi đổi trạng thái' });
    }
});


/* ==========================================================
   3. API KHÁCH HÀNG (BẢNG KHACH_HANG)
   ========================================================== */
// Lấy danh sách
router.get('/customers', async (req, res) => {
    try {
        const { q = '', status = '' } = req.query;
        let sql = 'SELECT * FROM khach_hang WHERE 1=1';
        const params = [];

        if (q) {
            sql += ' AND (ho_ten LIKE ? OR email LIKE ? OR so_dien_thoai LIKE ?)';
            params.push(`%${q}%`, `%${q}%`, `%${q}%`);
        }
        if (status) {
            sql += ' AND trang_thai = ?';
            params.push(status);
        }
        sql += ' ORDER BY id DESC';

        const [customers] = await pool.query(sql, params);
        
        const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM khach_hang');
        const [[{ active }]] = await pool.query('SELECT COUNT(*) as active FROM khach_hang WHERE trang_thai="hoat_dong"');
        const [[{ locked }]] = await pool.query('SELECT COUNT(*) as locked FROM khach_hang WHERE trang_thai="khoa"');
        const [[{ newThisMonth }]] = await pool.query('SELECT COUNT(*) as newThisMonth FROM khach_hang WHERE MONTH(created_at)=MONTH(NOW()) AND YEAR(created_at)=YEAR(NOW())');

        return res.json({ customers, stats: { total, active, locked, newThisMonth } });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi lấy danh sách Khách hàng' });
    }
});

// Thêm Khách hàng
router.post('/customers', async (req, res) => {
    const { ho_ten, email, so_dien_thoai, dia_chi, trang_thai } = req.body;
    try {
        await pool.query(
            'INSERT INTO khach_hang (ho_ten, email, so_dien_thoai, dia_chi, trang_thai) VALUES (?, ?, ?, ?, ?)',
            [ho_ten, email, so_dien_thoai || null, dia_chi || null, trang_thai || 'hoat_dong']
        );
        return res.status(201).json({ message: 'Thêm Khách hàng thành công' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email đã tồn tại!' });
        return res.status(500).json({ error: 'Lỗi thêm Khách hàng' });
    }
});

// Sửa Khách hàng
router.put('/customers/:id', async (req, res) => {
    const { ho_ten, email, so_dien_thoai, dia_chi, trang_thai } = req.body;
    try {
        await pool.query(
            'UPDATE khach_hang SET ho_ten=?, email=?, so_dien_thoai=?, dia_chi=?, trang_thai=? WHERE id=?',
            [ho_ten, email, so_dien_thoai || null, dia_chi || null, trang_thai, req.params.id]
        );
        return res.json({ message: 'Cập nhật Khách hàng thành công' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi cập nhật Khách hàng' });
    }
});

// Xóa Khách hàng
router.delete('/customers/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM khach_hang WHERE id = ?', [req.params.id]);
        return res.json({ message: 'Đã xóa Khách hàng' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi xóa Khách hàng' });
    }
});

// Đổi trạng thái
router.patch('/customers/:id/status', async (req, res) => {
    try {
        await pool.query('UPDATE khach_hang SET trang_thai=? WHERE id=?', [req.body.trang_thai, req.params.id]);
        return res.json({ message: 'Đổi trạng thái thành công' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi đổi trạng thái' });
    }
});


/* ==========================================================
   4. API SẢN PHẨM & DỊCH VỤ (BẢNG SAN_PHAM)
   ========================================================== */
// Lấy danh sách
router.get('/products', async (req, res) => {
    try {
        const { q = '', loai = '' } = req.query;
        let sql = 'SELECT * FROM san_pham WHERE 1=1';
        const params = [];

        if (q) {
            sql += ' AND (ten_san_pham LIKE ? OR ma_san_pham LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }
        if (loai) {
            sql += ' AND loai_san_pham = ?';
            params.push(loai);
        }
        sql += ' ORDER BY danh_muc_id, id DESC';

        const [products] = await pool.query(sql, params);
        
        const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM san_pham');
        const [[{ active }]] = await pool.query('SELECT COUNT(*) as active FROM san_pham WHERE trang_thai="dang_ban"');

        return res.json({ products, stats: { total, active } });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi tải danh sách sản phẩm' });
    }
});

// Thêm Sản phẩm
router.post('/products', async (req, res) => {
    const { ma_san_pham, ten_san_pham, slug, danh_muc_id, loai_san_pham, gia_niem_yet, don_vi_tinh, trang_thai } = req.body;
    try {
        await pool.query(
            'INSERT INTO san_pham (ma_san_pham, ten_san_pham, slug, danh_muc_id, loai_san_pham, gia_niem_yet, don_vi_tinh, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [ma_san_pham, ten_san_pham, slug, danh_muc_id || 1, loai_san_pham || 'dich_vu_so', gia_niem_yet || 0, don_vi_tinh, trang_thai]
        );
        return res.status(201).json({ message: 'Thêm sản phẩm thành công' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Mã sản phẩm hoặc Slug đã tồn tại.' });
        return res.status(500).json({ error: 'Lỗi thêm sản phẩm' });
    }
});

// Sửa Sản phẩm
router.put('/products/:id', async (req, res) => {
    const { ma_san_pham, ten_san_pham, slug, danh_muc_id, loai_san_pham, gia_niem_yet, don_vi_tinh, trang_thai } = req.body;
    try {
        await pool.query(
            'UPDATE san_pham SET ma_san_pham=?, ten_san_pham=?, slug=?, danh_muc_id=?, loai_san_pham=?, gia_niem_yet=?, don_vi_tinh=?, trang_thai=? WHERE id=?',
            [ma_san_pham, ten_san_pham, slug, danh_muc_id, loai_san_pham, gia_niem_yet, don_vi_tinh, trang_thai, req.params.id]
        );
        return res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi cập nhật sản phẩm' });
    }
});

// Xóa Sản phẩm
router.delete('/products/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM san_pham WHERE id = ?', [req.params.id]);
        return res.json({ message: 'Đã xóa sản phẩm' });
    } catch (err) {
        return res.status(400).json({ error: 'Không thể xóa vì sản phẩm này đang liên kết với đơn hàng.' });
    }
});

/* ==========================================================
   5. API ĐƠN HÀNG (GIỮ NGUYÊN TỪ FILE CŨ CỦA BẠN)
   ========================================================== */
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