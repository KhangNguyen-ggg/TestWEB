-- =========================================================
-- ADMIN PANEL DATABASE
-- Tạo database + 2 bảng: admins, customers
-- Chạy file này trong phpMyAdmin hoặc MySQL CLI:
--   mysql -u root -p < admin_panel/database.sql
-- =========================================================

CREATE DATABASE IF NOT EXISTS vnpt_admin
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vnpt_admin;

-- =========================================================
-- BẢNG 1: admins — Tài khoản quản trị viên
-- =========================================================
CREATE TABLE IF NOT EXISTS admins (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ho_ten      VARCHAR(150)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    mat_khau    VARCHAR(255)  NOT NULL COMMENT 'Lưu bằng password_hash()',
    vai_tro     ENUM('superadmin','admin','editor') NOT NULL DEFAULT 'admin',
    trang_thai  ENUM('hoat_dong','khoa') NOT NULL DEFAULT 'hoat_dong',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- BẢNG 2: customers — Khách hàng
-- =========================================================
CREATE TABLE IF NOT EXISTS customers (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ho_ten      VARCHAR(150)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    so_dien_thoai VARCHAR(15) NULL,
    dia_chi     VARCHAR(255)  NULL,
    trang_thai  ENUM('hoat_dong','khoa') NOT NULL DEFAULT 'hoat_dong',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- DỮ LIỆU MẪU — admins
-- Mật khẩu: Admin@123456  (hash password_hash tương ứng)
-- =========================================================
INSERT INTO admins (ho_ten, email, mat_khau, vai_tro, trang_thai) VALUES
('Nguyễn Văn Quản Trị',  'admin@vnvd.vn',       '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'hoat_dong'),
('Trần Thị Biên Tập',    'editor@vnvd.vn',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor',     'hoat_dong'),
('Lê Minh Quản Lý',      'manager@vnvd.vn',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',      'hoat_dong'),
('Phạm Thị Hoa',         'hoa.pham@vnvd.vn',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',      'khoa'),
('Hoàng Văn Dũng',       'dung.hoang@vnvd.vn',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor',     'hoat_dong');

-- =========================================================
-- DỮ LIỆU MẪU — customers
-- =========================================================
INSERT INTO customers (ho_ten, email, so_dien_thoai, dia_chi, trang_thai) VALUES
('Nguyễn Thị Lan',       'lan.nguyen@gmail.com',    '0901234567', '12 Lê Lợi, Q.1, TP.HCM',                    'hoat_dong'),
('Trần Văn Bình',        'binh.tran@gmail.com',     '0912345678', '45 Nguyễn Huệ, Q.1, TP.HCM',               'hoat_dong'),
('Lê Thị Hương',         'huong.le@yahoo.com',      '0923456789', '78 Trần Hưng Đạo, Q.5, TP.HCM',            'hoat_dong'),
('Phạm Minh Tuấn',       'tuan.pham@outlook.com',   '0934567890', '23 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM', 'hoat_dong'),
('Hoàng Thị Mai',        'mai.hoang@gmail.com',     '0945678901', '56 Võ Văn Tần, Q.3, TP.HCM',               'hoat_dong'),
('Đặng Văn Hùng',        'hung.dang@gmail.com',     '0956789012', '89 Cách Mạng Tháng 8, Q.10, TP.HCM',       'khoa'),
('Bùi Thị Ngọc',         'ngoc.bui@gmail.com',      '0967890123', '34 Lý Thường Kiệt, Q.10, TP.HCM',          'hoat_dong'),
('Vũ Minh Khoa',         'khoa.vu@gmail.com',       '0978901234', '67 Nguyễn Trãi, Q.5, TP.HCM',              'hoat_dong'),
('Ngô Thị Thu',          'thu.ngo@gmail.com',       '0989012345', '90 Hai Bà Trưng, Q.1, TP.HCM',             'hoat_dong'),
('Đinh Văn Phúc',        'phuc.dinh@gmail.com',     '0990123456', '11 Pasteur, Q.1, TP.HCM',                  'hoat_dong'),
('Lý Thị Bảo Châu',      'chau.ly@gmail.com',       '0901122334', '22 Nguyễn Đình Chiểu, Q.3, TP.HCM',        'hoat_dong'),
('Trương Văn Đức',       'duc.truong@gmail.com',    '0912233445', '33 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',  'hoat_dong'),
('Phan Thị Yến',         'yen.phan@gmail.com',      '0923344556', '44 Lê Văn Sỹ, Q.3, TP.HCM',               'khoa'),
('Cao Minh Nhật',        'nhat.cao@gmail.com',      '0934455667', '55 Trường Chinh, Q.Tân Bình, TP.HCM',      'hoat_dong'),
('Đỗ Thị Thanh Hà',      'ha.do@gmail.com',         '0945566778', '66 Cộng Hòa, Q.Tân Bình, TP.HCM',         'hoat_dong');

-- =========================================================
-- GHI CHÚ SỬ DỤNG
-- =========================================================
-- Mật khẩu mẫu cho tất cả admin: password
-- (hash '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' = 'password')
-- Khi chạy thật, đổi mật khẩu qua giao diện Admin Panel.
