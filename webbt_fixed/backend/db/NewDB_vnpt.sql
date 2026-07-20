SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `ap_dung_khuyen_mai`
CREATE TABLE `ap_dung_khuyen_mai` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `khuyen_mai_id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED DEFAULT NULL,
  `danh_muc_id` bigint(20) UNSIGNED DEFAULT NULL,
  KEY `khuyen_mai_id` (`khuyen_mai_id`),
  KEY `san_pham_id` (`san_pham_id`),
  KEY `danh_muc_id` (`danh_muc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `bai_viet`
CREATE TABLE `bai_viet` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `danh_muc_bai_viet_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `tom_tat` varchar(500) DEFAULT NULL,
  `noi_dung` longtext DEFAULT NULL,
  `anh_bia` varchar(255) DEFAULT NULL,
  `tac_gia_id` bigint(20) UNSIGNED DEFAULT NULL,
  `trang_thai` enum('nhap','da_dang','an') DEFAULT 'nhap',
  `ngay_xuat_ban` datetime DEFAULT NULL,
  UNIQUE KEY `slug` (`slug`),
  KEY `danh_muc_bai_viet_id` (`danh_muc_bai_viet_id`),
  KEY `tac_gia_id` (`tac_gia_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `bien_the_san_pham`
CREATE TABLE `bien_the_san_pham` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `ten_bien_the` varchar(150) NOT NULL,
  `gia_chenh_lech` decimal(15,2) DEFAULT 0.00,
  `ma_vach` varchar(50) DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT 1,
  KEY `san_pham_id` (`san_pham_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `cau_hoi_thuong_gap`
CREATE TABLE `cau_hoi_thuong_gap` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `danh_muc` varchar(100) DEFAULT NULL,
  `cau_hoi` varchar(500) NOT NULL,
  `cau_tra_loi` text NOT NULL,
  `thu_tu` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `dang_ky_dich_vu`
CREATE TABLE `dang_ky_dich_vu` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `khach_hang_id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `so_dien_thoai_dang_ky` varchar(15) DEFAULT NULL,
  `dia_chi_lap_dat` varchar(255) DEFAULT NULL,
  `ngay_dang_ky` datetime DEFAULT current_timestamp(),
  `ngay_kich_hoat_du_kien` date DEFAULT NULL,
  `trang_thai` enum('cho_xu_ly','dang_lap_dat','da_kich_hoat','tu_choi','huy') DEFAULT 'cho_xu_ly',
  `nhan_vien_xu_ly_id` bigint(20) UNSIGNED DEFAULT NULL,
  KEY `khach_hang_id` (`khach_hang_id`),
  KEY `san_pham_id` (`san_pham_id`),
  KEY `nhan_vien_xu_ly_id` (`nhan_vien_xu_ly_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `danh_gia_san_pham`
CREATE TABLE `danh_gia_san_pham` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `khach_hang_id` bigint(20) UNSIGNED NOT NULL,
  `don_hang_chi_tiet_id` bigint(20) UNSIGNED DEFAULT NULL,
  `so_sao` tinyint(4) NOT NULL CHECK (`so_sao` between 1 and 5),
  `tieu_de` varchar(200) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `hinh_anh_dinh_kem` json DEFAULT NULL,
  `trang_thai_duyet` enum('cho_duyet','da_duyet','tu_choi') DEFAULT 'cho_duyet',
  `created_at` datetime DEFAULT current_timestamp(),
  KEY `khach_hang_id` (`khach_hang_id`),
  KEY `don_hang_chi_tiet_id` (`don_hang_chi_tiet_id`),
  KEY `idx_danhgia_sanpham_duyet` (`san_pham_id`,`trang_thai_duyet`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `danh_muc_bai_viet`
CREATE TABLE `danh_muc_bai_viet` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten` varchar(150) NOT NULL,
  `slug` varchar(160) NOT NULL,
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `danh_muc_san_pham`
CREATE TABLE `danh_muc_san_pham` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten_danh_muc` varchar(150) NOT NULL,
  `danh_muc_cha_id` bigint(20) UNSIGNED DEFAULT NULL,
  `slug` varchar(160) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `hinh_anh_url` varchar(255) DEFAULT NULL,
  `thu_tu_hien_thi` int(11) DEFAULT 0,
  `trang_thai` tinyint(1) DEFAULT 1,
  UNIQUE KEY `slug` (`slug`),
  KEY `danh_muc_cha_id` (`danh_muc_cha_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `danh_muc_san_pham` (`id`, `ten_danh_muc`, `danh_muc_cha_id`, `slug`, `mo_ta`, `hinh_anh_url`, `thu_tu_hien_thi`, `trang_thai`) VALUES
(1, 'Dịch vụ chuyển đổi số', NULL, 'dich-vu-chuyen-doi-so', 'Các dịch vụ hạ tầng số, bảo mật, cloud, AI...', NULL, 1, 1),
(2, 'Gói bảng giá', NULL, 'goi-bang-gia', 'Các gói dịch vụ đóng gói theo quy mô doanh nghiệp', NULL, 2, 1);

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `dia_chi_khach_hang`
CREATE TABLE `dia_chi_khach_hang` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `khach_hang_id` bigint(20) UNSIGNED NOT NULL,
  `ten_nguoi_nhan` varchar(150) NOT NULL,
  `so_dien_thoai` varchar(15) NOT NULL,
  `tinh_thanh` varchar(100) NOT NULL,
  `quan_huyen` varchar(100) NOT NULL,
  `phuong_xa` varchar(100) NOT NULL,
  `dia_chi_chi_tiet` varchar(255) NOT NULL,
  `loai_dia_chi` enum('giao_hang','thanh_toan','ca_hai') DEFAULT 'ca_hai',
  `la_mac_dinh` tinyint(1) DEFAULT 0,
  KEY `khach_hang_id` (`khach_hang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `don_hang`
CREATE TABLE `don_hang` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ma_don_hang` varchar(30) NOT NULL,
  `khach_hang_id` bigint(20) UNSIGNED NOT NULL,
  `dia_chi_giao_hang_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tong_tien_hang` decimal(15,2) NOT NULL DEFAULT 0.00,
  `phi_van_chuyen` decimal(15,2) DEFAULT 0.00,
  `giam_gia` decimal(15,2) DEFAULT 0.00,
  `tong_thanh_toan` decimal(15,2) NOT NULL DEFAULT 0.00,
  `ma_giam_gia_id` bigint(20) UNSIGNED DEFAULT NULL,
  `trang_thai_don_hang` enum('cho_xac_nhan','da_xac_nhan','dang_giao','hoan_thanh','da_huy') DEFAULT 'cho_xac_nhan',
  `ghi_chu` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `ma_don_hang` (`ma_don_hang`),
  KEY `dia_chi_giao_hang_id` (`dia_chi_giao_hang_id`),
  KEY `ma_giam_gia_id` (`ma_giam_gia_id`),
  KEY `idx_donhang_khachhang_trangthai` (`khach_hang_id`,`trang_thai_don_hang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `don_hang_chi_tiet`
CREATE TABLE `don_hang_chi_tiet` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `don_hang_id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `bien_the_san_pham_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ten_san_pham_snapshot` varchar(255) NOT NULL,
  `so_luong` int(11) NOT NULL,
  `don_gia` decimal(15,2) NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  KEY `don_hang_id` (`don_hang_id`),
  KEY `san_pham_id` (`san_pham_id`),
  KEY `bien_the_san_pham_id` (`bien_the_san_pham_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `gia_tri_thuoc_tinh`
CREATE TABLE `gia_tri_thuoc_tinh` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `thuoc_tinh_id` bigint(20) UNSIGNED NOT NULL,
  `gia_tri` varchar(255) NOT NULL,
  KEY `san_pham_id` (`san_pham_id`),
  KEY `thuoc_tinh_id` (`thuoc_tinh_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `gio_hang`
CREATE TABLE `gio_hang` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `khach_hang_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  KEY `khach_hang_id` (`khach_hang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `gio_hang_chi_tiet`
CREATE TABLE `gio_hang_chi_tiet` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `gio_hang_id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `bien_the_san_pham_id` bigint(20) UNSIGNED DEFAULT NULL,
  `so_luong` int(11) NOT NULL DEFAULT 1,
  `don_gia_tai_thoi_diem` decimal(15,2) NOT NULL,
  KEY `gio_hang_id` (`gio_hang_id`),
  KEY `san_pham_id` (`san_pham_id`),
  KEY `bien_the_san_pham_id` (`bien_the_san_pham_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `goi_cuoc_di_dong`
CREATE TABLE `goi_cuoc_di_dong` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `loai_thue_bao` enum('tra_truoc','tra_sau') NOT NULL,
  `dung_luong_data_mb` int(11) DEFAULT NULL,
  `so_phut_goi_noi_mang` int(11) DEFAULT NULL,
  `so_phut_goi_ngoai_mang` int(11) DEFAULT NULL,
  `so_sms` int(11) DEFAULT NULL,
  `chu_ky_ngay` int(11) DEFAULT 30,
  `gia_han_tu_dong` tinyint(1) DEFAULT 0,
  UNIQUE KEY `san_pham_id` (`san_pham_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `goi_internet_truyen_hinh`
CREATE TABLE `goi_internet_truyen_hinh` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `cong_nghe` enum('FTTH','ADSL') DEFAULT 'FTTH',
  `toc_do_download_mbps` int(11) DEFAULT NULL,
  `toc_do_upload_mbps` int(11) DEFAULT NULL,
  `co_truyen_hinh_mytv` tinyint(1) DEFAULT 0,
  `so_kenh_truyen_hinh` int(11) DEFAULT NULL,
  `doi_tuong` enum('ho_gia_dinh','doanh_nghiep') DEFAULT 'ho_gia_dinh',
  UNIQUE KEY `san_pham_id` (`san_pham_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `hinh_anh_san_pham`
CREATE TABLE `hinh_anh_san_pham` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `la_anh_dai_dien` tinyint(1) DEFAULT 0,
  `thu_tu` int(11) DEFAULT 0,
  KEY `san_pham_id` (`san_pham_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `khach_hang`
CREATE TABLE `khach_hang` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ho_ten` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  `mat_khau_hash` varchar(255) NOT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `gioi_tinh` enum('nam','nu','khac') DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `trang_thai` enum('hoat_dong','khoa','cho_xac_thuc') NOT NULL DEFAULT 'cho_xac_thuc',
  `da_xac_thuc_email` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `kho_hang`
CREATE TABLE `kho_hang` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten_kho` varchar(150) NOT NULL,
  `tinh_thanh` varchar(100) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `khuyen_mai`
CREATE TABLE `khuyen_mai` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten_chuong_trinh` varchar(200) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `loai_giam` enum('phan_tram','tien_mat') NOT NULL,
  `gia_tri_giam` decimal(15,2) NOT NULL,
  `ngay_bat_dau` datetime NOT NULL,
  `ngay_ket_thuc` datetime NOT NULL,
  `trang_thai` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `khu_vuc_phu_song`
CREATE TABLE `khu_vuc_phu_song` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `tinh_thanh` varchar(100) NOT NULL,
  `quan_huyen` varchar(100) DEFAULT NULL,
  KEY `san_pham_id` (`san_pham_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `lich_su_trang_thai_don_hang`
CREATE TABLE `lich_su_trang_thai_don_hang` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `don_hang_id` bigint(20) UNSIGNED NOT NULL,
  `trang_thai` varchar(50) NOT NULL,
  `ghi_chu` varchar(255) DEFAULT NULL,
  `nhan_vien_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  KEY `don_hang_id` (`don_hang_id`),
  KEY `nhan_vien_id` (`nhan_vien_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `ma_giam_gia`
CREATE TABLE `ma_giam_gia` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ma_code` varchar(50) NOT NULL,
  `loai_giam` enum('phan_tram','tien_mat') NOT NULL,
  `gia_tri_giam` decimal(15,2) NOT NULL,
  `gia_tri_don_toi_thieu` decimal(15,2) DEFAULT 0.00,
  `so_luong_gioi_han` int(11) DEFAULT NULL,
  `so_luong_da_dung` int(11) DEFAULT 0,
  `ngay_het_han` datetime DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT 1,
  UNIQUE KEY `ma_code` (`ma_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `menu`
CREATE TABLE `menu` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten_menu` varchar(100) NOT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `link` varchar(255) DEFAULT '#',
  `menu_cha_id` bigint(20) UNSIGNED DEFAULT NULL,
  `thu_tu` int(11) DEFAULT 0,
  `trang_thai` tinyint(1) DEFAULT 1,
  KEY `menu_cha_id` (`menu_cha_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `menu` (`id`, `ten_menu`, `slug`, `link`, `menu_cha_id`, `thu_tu`, `trang_thai`) VALUES
(1, 'Về chúng tôi', 'gioi-thieu', '#', NULL, 1, 1),
(2, 'Dịch vụ', 'cloud-computing', '#', NULL, 2, 1),
(3, 'Giải pháp', 'gp-sme', '#', NULL, 3, 1),
(4, 'Bảng giá', '', '#pricing', NULL, 4, 1),
(5, 'Hệ sinh thái', 'he-sinh-thai', '#', NULL, 5, 1),
(6, 'Tin tức', 'thong-cao-bao-chi', '#', NULL, 6, 1),
(7, 'Đối tác', 'doi-tac', '#', NULL, 7, 1),
(8, 'Liên hệ', '', '#contact', NULL, 8, 1),
(9, 'Giới thiệu', 'gioi-thieu', '#', 1, 1, 1),
(10, 'Tầm nhìn & Sứ mệnh', 'tam-nhin-su-menh', '#', 1, 2, 1),
(11, 'Đội ngũ lãnh đạo', 'doi-ngu-lanh-dao', '#', 1, 3, 1),
(12, 'Thành tựu', 'thanh-tuu', '#', 1, 4, 1),
(13, 'Hạ tầng số', 'ha-tang-so', '#', 2, 1, 1),
(14, 'Bảo mật & An toàn', 'bao-mat-an-toan', '#', 2, 2, 1),
(15, 'Cloud Computing', 'cloud-computing', '#', 2, 3, 1),
(16, 'AI & Tự động hóa', 'ai-tu-dong-hoa', '#', 2, 4, 1),
(17, 'Doanh nghiệp vừa & nhỏ', 'gp-sme', '#', 3, 1, 1),
(18, 'Tập đoàn lớn', 'gp-enterprise', '#', 3, 2, 1),
(19, 'Chính phủ số', 'gp-chinh-phu', '#', 3, 3, 1),
(20, 'Y tế & Giáo dục', 'gp-yte-giaoduc', '#', 3, 4, 1),
(21, 'Thông cáo báo chí', 'thong-cao-bao-chi', '#', 6, 1, 1),
(22, 'Blog công nghệ', 'blog-cong-nghe', '#', 6, 2, 1),
(23, 'Sự kiện', 'su-kien', '#', 6, 3, 1);

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `nhan_vien`
CREATE TABLE `nhan_vien` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ho_ten` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mat_khau_hash` varchar(255) NOT NULL,
  `vai_tro_id` bigint(20) UNSIGNED NOT NULL,
  `trang_thai` enum('hoat_dong','khoa') DEFAULT 'hoat_dong',
  `created_at` datetime DEFAULT current_timestamp(),
  UNIQUE KEY `email` (`email`),
  KEY `vai_tro_id` (`vai_tro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nhan_vien` (`id`, `ho_ten`, `email`, `mat_khau_hash`, `vai_tro_id`, `trang_thai`, `created_at`) VALUES
(1, 'Quản trị viên', 'admin@vnvd.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4XY0uKuqk5m1oX8dM0hV7kQ6H2Fe', 1, 'hoat_dong', '2026-07-08 08:11:23');

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `nha_cung_cap`
CREATE TABLE `nha_cung_cap` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten` varchar(200) NOT NULL,
  `ma_so_thue` varchar(30) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `sdt_lien_he` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `phan_hoi_ho_tro`
CREATE TABLE `phan_hoi_ho_tro` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `yeu_cau_ho_tro_id` bigint(20) UNSIGNED NOT NULL,
  `nguoi_gui_id` bigint(20) UNSIGNED NOT NULL,
  `nguoi_gui_loai` enum('khach_hang','nhan_vien') NOT NULL,
  `noi_dung` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  KEY `yeu_cau_ho_tro_id` (`yeu_cau_ho_tro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `phuong_thuc_thanh_toan`
CREATE TABLE `phuong_thuc_thanh_toan` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten` varchar(100) NOT NULL,
  `trang_thai` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `phuong_thuc_thanh_toan` (`id`, `ten`, `trang_thai`) VALUES
(1, 'Thanh toán khi nhận hàng (COD)', 1),
(2, 'Chuyển khoản ngân hàng', 1),
(3, 'Ví điện tử / VNPAY', 1);

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `phuong_thuc_van_chuyen`
CREATE TABLE `phuong_thuc_van_chuyen` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten` varchar(100) NOT NULL,
  `phi_co_ban` decimal(15,2) DEFAULT 0.00,
  `thoi_gian_du_kien` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `phuong_thuc_van_chuyen` (`id`, `ten`, `phi_co_ban`, `thoi_gian_du_kien`) VALUES
(1, 'Kích hoạt trực tuyến', 0.00, 'Trong 24h'),
(2, 'Nhân viên tư vấn liên hệ', 0.00, '1-2 ngày làm việc');

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `quyen_han`
CREATE TABLE `quyen_han` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ma_quyen` varchar(100) NOT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  UNIQUE KEY `ma_quyen` (`ma_quyen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `san_pham`
CREATE TABLE `san_pham` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ma_san_pham` varchar(50) NOT NULL,
  `ten_san_pham` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `danh_muc_id` bigint(20) UNSIGNED NOT NULL,
  `loai_san_pham` enum('goi_cuoc_di_dong','goi_internet_truyen_hinh','thiet_bi','dich_vu_so','combo') NOT NULL,
  `thuong_hieu` varchar(100) DEFAULT NULL,
  `nha_cung_cap_id` bigint(20) UNSIGNED DEFAULT NULL,
  `mo_ta_ngan` varchar(500) DEFAULT NULL,
  `mo_ta_chi_tiet` longtext DEFAULT NULL,
  `gia_niem_yet` decimal(15,2) NOT NULL DEFAULT 0.00,
  `gia_khuyen_mai` decimal(15,2) DEFAULT NULL,
  `don_vi_tinh` varchar(30) DEFAULT 'sản phẩm',
  `co_quan_ly_ton_kho` tinyint(1) DEFAULT 0,
  `trang_thai` enum('dang_ban','ngung_ban','sap_ra_mat') DEFAULT 'dang_ban',
  `luot_xem` int(11) DEFAULT 0,
  `luot_ban` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `ma_san_pham` (`ma_san_pham`),
  UNIQUE KEY `slug` (`slug`),
  KEY `nha_cung_cap_id` (`nha_cung_cap_id`),
  KEY `idx_san_pham_danhmuc_trangthai` (`danh_muc_id`,`trang_thai`),
  KEY `idx_san_pham_loai` (`loai_san_pham`),
  FULLTEXT KEY `ft_ten_san_pham` (`ten_san_pham`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `san_pham` (`id`, `ma_san_pham`, `ten_san_pham`, `slug`, `danh_muc_id`, `loai_san_pham`, `thuong_hieu`, `nha_cung_cap_id`, `mo_ta_ngan`, `mo_ta_chi_tiet`, `gia_niem_yet`, `gia_khuyen_mai`, `don_vi_tinh`, `co_quan_ly_ton_kho`, `trang_thai`, `luot_xem`, `luot_ban`, `created_at`, `updated_at`) VALUES
(1, 'svc-001', 'Cloud Computing', 'cloud-computing', 1, 'dich_vu_so', 'VNVD', NULL, 'Hạ tầng điện toán đám mây linh hoạt, mở rộng theo nhu cầu.', NULL, 2500000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(2, 'svc-002', 'Bảo mật & An toàn số', 'bao-mat-an-toan-so', 1, 'dich_vu_so', 'VNVD', NULL, 'Giải pháp bảo mật toàn diện, giám sát 24/7.', NULL, 1800000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(3, 'svc-003', 'AI & Tự động hóa', 'ai-tu-dong-hoa', 1, 'dich_vu_so', 'VNVD', NULL, 'Ứng dụng trí tuệ nhân tạo tự động hóa quy trình nghiệp vụ.', NULL, 3200000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(4, 'svc-004', 'Hạ tầng mạng 5G', 'ha-tang-mang-5g', 1, 'dich_vu_so', 'VNVD', NULL, 'Kết nối 5G/SD-WAN tốc độ cao, độ trễ thấp cho doanh nghiệp.', NULL, 4500000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(5, 'svc-005', 'Quản trị doanh nghiệp số', 'quan-tri-doanh-nghiep-so', 1, 'dich_vu_so', 'VNVD', NULL, 'Nền tảng quản trị, điều hành doanh nghiệp trên môi trường số.', NULL, 990000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(6, 'svc-006', 'Giao tiếp & Cộng tác', 'giao-tiep-cong-tac', 1, 'dich_vu_so', 'VNVD', NULL, 'Hội họp trực tuyến, cộng tác nhóm bảo mật.', NULL, 750000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(7, 'svc-007', 'Big Data & Phân tích', 'big-data-phan-tich', 1, 'dich_vu_so', 'VNVD', NULL, 'Thu thập, phân tích dữ liệu lớn hỗ trợ ra quyết định.', NULL, 2100000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(8, 'svc-008', 'IoT & Smart City', 'iot-smart-city', 1, 'dich_vu_so', 'VNVD', NULL, 'Kết nối vạn vật, giải pháp đô thị thông minh.', NULL, 1500000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(9, 'pkg-basic', 'Gói Cơ bản', 'goi-co-ban', 2, 'combo', 'VNVD', NULL, 'Gói khởi đầu cho doanh nghiệp nhỏ.', NULL, 990000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(10, 'pkg-business', 'Gói Doanh nghiệp', 'goi-doanh-nghiep', 2, 'combo', 'VNVD', NULL, 'Gói phổ biến cho doanh nghiệp vừa.', NULL, 2900000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23'),
(11, 'pkg-premium', 'Gói Cao cấp', 'goi-cao-cap', 2, 'combo', 'VNVD', NULL, 'Giải pháp toàn diện cho tập đoàn lớn.', NULL, 7500000.00, NULL, 'tháng', 0, 'dang_ban', 0, 0, '2026-07-08 08:11:23', '2026-07-08 08:11:23');

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `san_pham_yeu_thich`
CREATE TABLE `san_pham_yeu_thich` (
  `khach_hang_id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`khach_hang_id`,`san_pham_id`),
  KEY `san_pham_id` (`san_pham_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `thanh_toan`
CREATE TABLE `thanh_toan` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `don_hang_id` bigint(20) UNSIGNED NOT NULL,
  `phuong_thuc_thanh_toan_id` bigint(20) UNSIGNED NOT NULL,
  `so_tien` decimal(15,2) NOT NULL,
  `ma_giao_dich` varchar(100) DEFAULT NULL,
  `trang_thai` enum('cho_thanh_toan','thanh_cong','that_bai','hoan_tien') DEFAULT 'cho_thanh_toan',
  `created_at` datetime DEFAULT current_timestamp(),
  KEY `don_hang_id` (`don_hang_id`),
  KEY `phuong_thuc_thanh_toan_id` (`phuong_thuc_thanh_toan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `thong_bao`
CREATE TABLE `thong_bao` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `khach_hang_id` bigint(20) UNSIGNED NOT NULL,
  `tieu_de` varchar(200) NOT NULL,
  `noi_dung` text DEFAULT NULL,
  `loai` enum('don_hang','khuyen_mai','he_thong') DEFAULT 'he_thong',
  `da_doc` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  KEY `khach_hang_id` (`khach_hang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `thuoc_tinh_san_pham`
CREATE TABLE `thuoc_tinh_san_pham` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten_thuoc_tinh` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `ton_kho`
CREATE TABLE `ton_kho` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `bien_the_san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `kho_id` bigint(20) UNSIGNED NOT NULL,
  `so_luong_ton` int(11) NOT NULL DEFAULT 0,
  `so_luong_dat_truoc` int(11) NOT NULL DEFAULT 0,
  UNIQUE KEY `uq_bienthe_kho` (`bien_the_san_pham_id`,`kho_id`),
  KEY `kho_id` (`kho_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `trang_tinh`
CREATE TABLE `trang_tinh` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `slug` varchar(100) NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trang_tinh` (`id`, `slug`, `tieu_de`, `mo_ta`, `icon`) VALUES
(1, 'gioi-thieu', 'Giới thiệu về VNVD', 'Nền tảng dịch vụ số toàn diện, đồng hành cùng doanh nghiệp Việt Nam trên hành trình chuyển đổi số.', 'building'),
(2, 'tam-nhin-su-menh', 'Tầm nhìn & Sứ mệnh', 'Mục tiêu trở thành đầu tàu dẫn dắt công cuộc chuyển đổi số quốc gia, mang lại giá trị thiết thực và bền vững cho cộng đồng.', 'target'),
(3, 'doi-ngu-lanh-dao', 'Đội ngũ lãnh đạo', 'Những chuyên gia hàng đầu với hàng chục năm kinh nghiệm trong lĩnh vực công nghệ thông tin và viễn thông tại Việt Nam.', 'users'),
(4, 'thanh-tuu', 'Thành tựu nổi bật', 'Hơn 30 năm phát triển với hàng loạt giải thưởng danh giá trong nước và quốc tế về đổi mới công nghệ và dịch vụ xuất sắc.', 'award'),
(5, 'ha-tang-so', 'Hạ tầng số hiện đại', 'Nền tảng hạ tầng công nghệ vững chắc, đáp ứng mọi nhu cầu mở rộng, lưu trữ và phát triển tốc độ cao của doanh nghiệp.', 'server'),
(6, 'bao-mat-an-toan', 'Bảo mật & An toàn thông tin', 'Hệ thống phòng thủ đa lớp, bảo vệ dữ liệu doanh nghiệp an toàn tuyệt đối trước mọi rủi ro và tấn công trên không gian mạng.', 'shield-check'),
(7, 'cloud-computing', 'Cloud Computing', 'Triển khai hạ tầng đám mây linh hoạt, giúp tối ưu hóa chi phí vận hành và tăng cường khả năng mở rộng không giới hạn.', 'cloud'),
(8, 'ai-tu-dong-hoa', 'AI & Tự động hóa', 'Ứng dụng trí tuệ nhân tạo tiên tiến để tối ưu hóa quy trình vận hành, phân tích dữ liệu và nâng cao hiệu suất làm việc.', 'cpu'),
(9, 'gp-sme', 'Giải pháp cho Doanh nghiệp vừa & nhỏ', 'Hệ sinh thái công nghệ được thiết kế tinh gọn, tối ưu chi phí nhưng vẫn đảm bảo tính năng toàn diện cho các SME.', 'briefcase'),
(10, 'gp-enterprise', 'Giải pháp cho Tập đoàn lớn', 'Hệ thống hạ tầng và phần mềm quản trị quy mô lớn, đáp ứng độ phức tạp cao, chuẩn hóa quy trình cho các tập đoàn đa quốc gia.', 'building-2'),
(11, 'gp-chinh-phu', 'Chính phủ số', 'Đồng hành xây dựng hệ thống chính phủ điện tử minh bạch, an toàn, hiệu quả nhằm phục vụ người dân và doanh nghiệp tốt hơn.', 'landmark'),
(12, 'gp-yte-giaoduc', 'Chuyển đổi số Y tế & Giáo dục', 'Cung cấp nền tảng số hóa hồ sơ bệnh án, quản lý trường học thông minh, mang lại tiện ích hiện đại cho toàn xã hội.', 'heart-pulse'),
(13, 'he-sinh-thai', 'Hệ sinh thái VNVD', 'Sự kết nối hoàn hảo giữa các giải pháp công nghệ, tạo nên một vòng tuần hoàn khép kín hỗ trợ tối đa cho doanh nghiệp.', 'network'),
(14, 'doi-tac', 'Đối tác chiến lược', 'Đồng hành cùng các tập đoàn công nghệ hàng đầu thế giới để mang lại những sản phẩm, giải pháp tối ưu và đột phá nhất.', 'handshake'),
(15, 'thong-cao-bao-chi', 'Thông cáo báo chí', 'Thông tin chính thức từ VNVD.', 'megaphone'),
(16, 'blog-cong-nghe', 'Blog công nghệ', 'Kiến thức, xu hướng và góc nhìn về chuyển đổi số.', 'newspaper'),
(19, 'su-kien', 'Sự kiện', 'Các sự kiện, hội thảo và chương trình sắp diễn ra.', 'calendar-days');

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `vai_tro`
CREATE TABLE `vai_tro` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten_vai_tro` varchar(100) NOT NULL,
  UNIQUE KEY `ten_vai_tro` (`ten_vai_tro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `vai_tro` (`id`, `ten_vai_tro`) VALUES
(1, 'admin'),
(2, 'nhan_vien');

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `vai_tro_quyen`
CREATE TABLE `vai_tro_quyen` (
  `vai_tro_id` bigint(20) UNSIGNED NOT NULL,
  `quyen_id` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`vai_tro_id`,`quyen_id`),
  KEY `quyen_id` (`quyen_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `van_chuyen_don_hang`
CREATE TABLE `van_chuyen_don_hang` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `don_hang_id` bigint(20) UNSIGNED NOT NULL,
  `phuong_thuc_van_chuyen_id` bigint(20) UNSIGNED NOT NULL,
  `ma_van_don` varchar(100) DEFAULT NULL,
  `trang_thai_giao_hang` varchar(50) DEFAULT 'cho_lay_hang',
  `ngay_giao_du_kien` date DEFAULT NULL,
  UNIQUE KEY `don_hang_id` (`don_hang_id`),
  KEY `phuong_thuc_van_chuyen_id` (`phuong_thuc_van_chuyen_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `yeu_cau_ho_tro`
CREATE TABLE `yeu_cau_ho_tro` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `khach_hang_id` bigint(20) UNSIGNED NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `loai_yeu_cau` enum('ky_thuat','thanh_toan','khieu_nai','khac') DEFAULT 'khac',
  `trang_thai` enum('moi','dang_xu_ly','da_giai_quyet') DEFAULT 'moi',
  `nhan_vien_xu_ly_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `khach_hang_id` (`khach_hang_id`),
  KEY `nhan_vien_xu_ly_id` (`nhan_vien_xu_ly_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================================
-- KHAI BÁO CÁC RÀNG BUỘC KHÓA NGOẠI (FOREIGN KEYS)
-- ========================================================

ALTER TABLE `ap_dung_khuyen_mai`
  ADD CONSTRAINT `ap_dung_khuyen_mai_ibfk_1` FOREIGN KEY (`khuyen_mai_id`) REFERENCES `khuyen_mai` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ap_dung_khuyen_mai_ibfk_2` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ap_dung_khuyen_mai_ibfk_3` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc_san_pham` (`id`) ON DELETE CASCADE;

ALTER TABLE `bai_viet`
  ADD CONSTRAINT `bai_viet_ibfk_1` FOREIGN KEY (`danh_muc_bai_viet_id`) REFERENCES `danh_muc_bai_viet` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bai_viet_ibfk_2` FOREIGN KEY (`tac_gia_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL;

ALTER TABLE `bien_the_san_pham`
  ADD CONSTRAINT `bien_the_san_pham_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

ALTER TABLE `dang_ky_dich_vu`
  ADD CONSTRAINT `dang_ky_dich_vu_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  ADD CONSTRAINT `dang_ky_dich_vu_ibfk_2` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`),
  ADD CONSTRAINT `dang_ky_dich_vu_ibfk_3` FOREIGN KEY (`nhan_vien_xu_ly_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL;

ALTER TABLE `danh_gia_san_pham`
  ADD CONSTRAINT `danh_gia_san_pham_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `danh_gia_san_pham_ibfk_2` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `danh_gia_san_pham_ibfk_3` FOREIGN KEY (`don_hang_chi_tiet_id`) REFERENCES `don_hang_chi_tiet` (`id`) ON DELETE SET NULL;

ALTER TABLE `danh_muc_san_pham`
  ADD CONSTRAINT `danh_muc_san_pham_ibfk_1` FOREIGN KEY (`danh_muc_cha_id`) REFERENCES `danh_muc_san_pham` (`id`) ON DELETE SET NULL;

ALTER TABLE `dia_chi_khach_hang`
  ADD CONSTRAINT `dia_chi_khach_hang_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`) ON DELETE CASCADE;

ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  ADD CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`dia_chi_giao_hang_id`) REFERENCES `dia_chi_khach_hang` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `don_hang_ibfk_3` FOREIGN KEY (`ma_giam_gia_id`) REFERENCES `ma_giam_gia` (`id`) ON DELETE SET NULL;

ALTER TABLE `don_hang_chi_tiet`
  ADD CONSTRAINT `don_hang_chi_tiet_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `don_hang_chi_tiet_ibfk_2` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`),
  ADD CONSTRAINT `don_hang_chi_tiet_ibfk_3` FOREIGN KEY (`bien_the_san_pham_id`) REFERENCES `bien_the_san_pham` (`id`);

ALTER TABLE `gia_tri_thuoc_tinh`
  ADD CONSTRAINT `gia_tri_thuoc_tinh_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gia_tri_thuoc_tinh_ibfk_2` FOREIGN KEY (`thuoc_tinh_id`) REFERENCES `thuoc_tinh_san_pham` (`id`) ON DELETE CASCADE;

ALTER TABLE `gio_hang`
  ADD CONSTRAINT `gio_hang_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`) ON DELETE CASCADE;

ALTER TABLE `gio_hang_chi_tiet`
  ADD CONSTRAINT `gio_hang_chi_tiet_ibfk_1` FOREIGN KEY (`gio_hang_id`) REFERENCES `gio_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gio_hang_chi_tiet_ibfk_2` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`),
  ADD CONSTRAINT `gio_hang_chi_tiet_ibfk_3` FOREIGN KEY (`bien_the_san_pham_id`) REFERENCES `bien_the_san_pham` (`id`);

ALTER TABLE `goi_cuoc_di_dong`
  ADD CONSTRAINT `goi_cuoc_di_dong_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

ALTER TABLE `goi_internet_truyen_hinh`
  ADD CONSTRAINT `goi_internet_truyen_hinh_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

ALTER TABLE `hinh_anh_san_pham`
  ADD CONSTRAINT `hinh_anh_san_pham_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

ALTER TABLE `khu_vuc_phu_song`
  ADD CONSTRAINT `khu_vuc_phu_song_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

ALTER TABLE `lich_su_trang_thai_don_hang`
  ADD CONSTRAINT `lich_su_trang_thai_don_hang_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lich_su_trang_thai_don_hang_ibfk_2` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL;

ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`menu_cha_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE;

ALTER TABLE `nhan_vien`
  ADD CONSTRAINT `nhan_vien_ibfk_1` FOREIGN KEY (`vai_tro_id`) REFERENCES `vai_tro` (`id`);

ALTER TABLE `phan_hoi_ho_tro`
  ADD CONSTRAINT `phan_hoi_ho_tro_ibfk_1` FOREIGN KEY (`yeu_cau_ho_tro_id`) REFERENCES `yeu_cau_ho_tro` (`id`) ON DELETE CASCADE;

ALTER TABLE `san_pham`
  ADD CONSTRAINT `san_pham_ibfk_1` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc_san_pham` (`id`),
  ADD CONSTRAINT `san_pham_ibfk_2` FOREIGN KEY (`nha_cung_cap_id`) REFERENCES `nha_cung_cap` (`id`) ON DELETE SET NULL;

ALTER TABLE `san_pham_yeu_thich`
  ADD CONSTRAINT `san_pham_yeu_thich_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `san_pham_yeu_thich_ibfk_2` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

ALTER TABLE `thanh_toan`
  ADD CONSTRAINT `thanh_toan_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `thanh_toan_ibfk_2` FOREIGN KEY (`phuong_thuc_thanh_toan_id`) REFERENCES `phuong_thuc_thanh_toan` (`id`);

ALTER TABLE `thong_bao`
  ADD CONSTRAINT `thong_bao_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`) ON DELETE CASCADE;

ALTER TABLE `ton_kho`
  ADD CONSTRAINT `ton_kho_ibfk_1` FOREIGN KEY (`bien_the_san_pham_id`) REFERENCES `bien_the_san_pham` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ton_kho_ibfk_2` FOREIGN KEY (`kho_id`) REFERENCES `kho_hang` (`id`);

ALTER TABLE `vai_tro_quyen`
  ADD CONSTRAINT `vai_tro_quyen_ibfk_1` FOREIGN KEY (`vai_tro_id`) REFERENCES `vai_tro` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vai_tro_quyen_ibfk_2` FOREIGN KEY (`quyen_id`) REFERENCES `quyen_han` (`id`) ON DELETE CASCADE;

ALTER TABLE `van_chuyen_don_hang`
  ADD CONSTRAINT `van_chuyen_don_hang_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `van_chuyen_don_hang_ibfk_2` FOREIGN KEY (`phuong_thuc_van_chuyen_id`) REFERENCES `phuong_thuc_van_chuyen` (`id`);

ALTER TABLE `yeu_cau_ho_tro`
  ADD CONSTRAINT `yeu_cau_ho_tro_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `yeu_cau_ho_tro_ibfk_2` FOREIGN KEY (`nhan_vien_xu_ly_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;