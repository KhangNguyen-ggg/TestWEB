-- =========================================================
-- DATABASE: website_vnpt
-- Website quảng bá & bán sản phẩm/dịch vụ Tập đoàn VNPT
-- Engine: MySQL 8.0+ (InnoDB, utf8mb4)
-- =========================================================



-- =========================================================
-- 1. NGƯỜI DÙNG & PHÂN QUYỀN
-- =========================================================

CREATE TABLE khach_hang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ho_ten VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  so_dien_thoai VARCHAR(15) UNIQUE,
  mat_khau_hash VARCHAR(255) NOT NULL,
  ngay_sinh DATE NULL,
  gioi_tinh ENUM('nam','nu','khac') NULL,
  avatar_url VARCHAR(255) NULL,
  trang_thai ENUM('hoat_dong','khoa','cho_xac_thuc') NOT NULL DEFAULT 'cho_xac_thuc',
  da_xac_thuc_email BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE dia_chi_khach_hang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  khach_hang_id BIGINT UNSIGNED NOT NULL,
  ten_nguoi_nhan VARCHAR(150) NOT NULL,
  so_dien_thoai VARCHAR(15) NOT NULL,
  tinh_thanh VARCHAR(100) NOT NULL,
  quan_huyen VARCHAR(100) NOT NULL,
  phuong_xa VARCHAR(100) NOT NULL,
  dia_chi_chi_tiet VARCHAR(255) NOT NULL,
  loai_dia_chi ENUM('giao_hang','thanh_toan','ca_hai') DEFAULT 'ca_hai',
  la_mac_dinh BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE vai_tro (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten_vai_tro VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE quyen_han (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ma_quyen VARCHAR(100) NOT NULL UNIQUE,
  mo_ta VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE vai_tro_quyen (
  vai_tro_id BIGINT UNSIGNED NOT NULL,
  quyen_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (vai_tro_id, quyen_id),
  FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(id) ON DELETE CASCADE,
  FOREIGN KEY (quyen_id) REFERENCES quyen_han(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE nhan_vien (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ho_ten VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mat_khau_hash VARCHAR(255) NOT NULL,
  vai_tro_id BIGINT UNSIGNED NOT NULL,
  trang_thai ENUM('hoat_dong','khoa') DEFAULT 'hoat_dong',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(id)
) ENGINE=InnoDB;

-- =========================================================
-- 2. SẢN PHẨM & DANH MỤC
-- =========================================================

CREATE TABLE danh_muc_san_pham (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten_danh_muc VARCHAR(150) NOT NULL,
  danh_muc_cha_id BIGINT UNSIGNED NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  mo_ta TEXT NULL,
  hinh_anh_url VARCHAR(255) NULL,
  thu_tu_hien_thi INT DEFAULT 0,
  trang_thai BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (danh_muc_cha_id) REFERENCES danh_muc_san_pham(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE nha_cung_cap (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten VARCHAR(200) NOT NULL,
  ma_so_thue VARCHAR(30),
  dia_chi VARCHAR(255),
  sdt_lien_he VARCHAR(15)
) ENGINE=InnoDB;

CREATE TABLE san_pham (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ma_san_pham VARCHAR(50) NOT NULL UNIQUE,
  ten_san_pham VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  danh_muc_id BIGINT UNSIGNED NOT NULL,
  loai_san_pham ENUM('goi_cuoc_di_dong','goi_internet_truyen_hinh','thiet_bi','dich_vu_so','combo') NOT NULL,
  thuong_hieu VARCHAR(100) NULL,
  nha_cung_cap_id BIGINT UNSIGNED NULL,
  mo_ta_ngan VARCHAR(500),
  mo_ta_chi_tiet LONGTEXT,
  gia_niem_yet DECIMAL(15,2) NOT NULL DEFAULT 0,
  gia_khuyen_mai DECIMAL(15,2) NULL,
  don_vi_tinh VARCHAR(30) DEFAULT 'sản phẩm',
  co_quan_ly_ton_kho BOOLEAN DEFAULT FALSE,
  trang_thai ENUM('dang_ban','ngung_ban','sap_ra_mat') DEFAULT 'dang_ban',
  luot_xem INT DEFAULT 0,
  luot_ban INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (danh_muc_id) REFERENCES danh_muc_san_pham(id),
  FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id) ON DELETE SET NULL,
  FULLTEXT KEY ft_ten_san_pham (ten_san_pham)
) ENGINE=InnoDB;

CREATE TABLE bien_the_san_pham (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  san_pham_id BIGINT UNSIGNED NOT NULL,
  ten_bien_the VARCHAR(150) NOT NULL,
  gia_chenh_lech DECIMAL(15,2) DEFAULT 0,
  ma_vach VARCHAR(50) NULL,
  trang_thai BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE hinh_anh_san_pham (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  san_pham_id BIGINT UNSIGNED NOT NULL,
  url VARCHAR(255) NOT NULL,
  la_anh_dai_dien BOOLEAN DEFAULT FALSE,
  thu_tu INT DEFAULT 0,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE thuoc_tinh_san_pham (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten_thuoc_tinh VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE gia_tri_thuoc_tinh (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  san_pham_id BIGINT UNSIGNED NOT NULL,
  thuoc_tinh_id BIGINT UNSIGNED NOT NULL,
  gia_tri VARCHAR(255) NOT NULL,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE,
  FOREIGN KEY (thuoc_tinh_id) REFERENCES thuoc_tinh_san_pham(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE kho_hang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten_kho VARCHAR(150) NOT NULL,
  tinh_thanh VARCHAR(100),
  dia_chi VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE ton_kho (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  bien_the_san_pham_id BIGINT UNSIGNED NOT NULL,
  kho_id BIGINT UNSIGNED NOT NULL,
  so_luong_ton INT NOT NULL DEFAULT 0,
  so_luong_dat_truoc INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_bienthe_kho (bien_the_san_pham_id, kho_id),
  FOREIGN KEY (bien_the_san_pham_id) REFERENCES bien_the_san_pham(id) ON DELETE CASCADE,
  FOREIGN KEY (kho_id) REFERENCES kho_hang(id)
) ENGINE=InnoDB;

-- =========================================================
-- 3. DỊCH VỤ VIỄN THÔNG (mở rộng 1-1 với san_pham)
-- =========================================================

CREATE TABLE goi_cuoc_di_dong (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  san_pham_id BIGINT UNSIGNED NOT NULL UNIQUE,
  loai_thue_bao ENUM('tra_truoc','tra_sau') NOT NULL,
  dung_luong_data_mb INT NULL,
  so_phut_goi_noi_mang INT NULL,
  so_phut_goi_ngoai_mang INT NULL,
  so_sms INT NULL,
  chu_ky_ngay INT DEFAULT 30,
  gia_han_tu_dong BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE goi_internet_truyen_hinh (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  san_pham_id BIGINT UNSIGNED NOT NULL UNIQUE,
  cong_nghe ENUM('FTTH','ADSL') DEFAULT 'FTTH',
  toc_do_download_mbps INT,
  toc_do_upload_mbps INT,
  co_truyen_hinh_mytv BOOLEAN DEFAULT FALSE,
  so_kenh_truyen_hinh INT NULL,
  doi_tuong ENUM('ho_gia_dinh','doanh_nghiep') DEFAULT 'ho_gia_dinh',
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE khu_vuc_phu_song (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  san_pham_id BIGINT UNSIGNED NOT NULL,
  tinh_thanh VARCHAR(100) NOT NULL,
  quan_huyen VARCHAR(100) NULL,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE dang_ky_dich_vu (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  khach_hang_id BIGINT UNSIGNED NOT NULL,
  san_pham_id BIGINT UNSIGNED NOT NULL,
  so_dien_thoai_dang_ky VARCHAR(15) NULL,
  dia_chi_lap_dat VARCHAR(255) NULL,
  ngay_dang_ky DATETIME DEFAULT CURRENT_TIMESTAMP,
  ngay_kich_hoat_du_kien DATE NULL,
  trang_thai ENUM('cho_xu_ly','dang_lap_dat','da_kich_hoat','tu_choi','huy') DEFAULT 'cho_xu_ly',
  nhan_vien_xu_ly_id BIGINT UNSIGNED NULL,
  FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id),
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id),
  FOREIGN KEY (nhan_vien_xu_ly_id) REFERENCES nhan_vien(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================================================
-- 4. BÁN HÀNG: GIỎ HÀNG, ĐƠN HÀNG, THANH TOÁN
-- =========================================================

CREATE TABLE gio_hang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  khach_hang_id BIGINT UNSIGNED NULL,
  session_id VARCHAR(100) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE gio_hang_chi_tiet (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  gio_hang_id BIGINT UNSIGNED NOT NULL,
  san_pham_id BIGINT UNSIGNED NOT NULL,
  bien_the_san_pham_id BIGINT UNSIGNED NULL,
  so_luong INT NOT NULL DEFAULT 1,
  don_gia_tai_thoi_diem DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (gio_hang_id) REFERENCES gio_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id),
  FOREIGN KEY (bien_the_san_pham_id) REFERENCES bien_the_san_pham(id)
) ENGINE=InnoDB;

CREATE TABLE ma_giam_gia (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ma_code VARCHAR(50) NOT NULL UNIQUE,
  loai_giam ENUM('phan_tram','tien_mat') NOT NULL,
  gia_tri_giam DECIMAL(15,2) NOT NULL,
  gia_tri_don_toi_thieu DECIMAL(15,2) DEFAULT 0,
  so_luong_gioi_han INT NULL,
  so_luong_da_dung INT DEFAULT 0,
  ngay_het_han DATETIME NULL,
  trang_thai BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE don_hang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ma_don_hang VARCHAR(30) NOT NULL UNIQUE,
  khach_hang_id BIGINT UNSIGNED NOT NULL,
  dia_chi_giao_hang_id BIGINT UNSIGNED NULL,
  tong_tien_hang DECIMAL(15,2) NOT NULL DEFAULT 0,
  phi_van_chuyen DECIMAL(15,2) DEFAULT 0,
  giam_gia DECIMAL(15,2) DEFAULT 0,
  tong_thanh_toan DECIMAL(15,2) NOT NULL DEFAULT 0,
  ma_giam_gia_id BIGINT UNSIGNED NULL,
  trang_thai_don_hang ENUM('cho_xac_nhan','da_xac_nhan','dang_giao','hoan_thanh','da_huy') DEFAULT 'cho_xac_nhan',
  ghi_chu TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id),
  FOREIGN KEY (dia_chi_giao_hang_id) REFERENCES dia_chi_khach_hang(id) ON DELETE SET NULL,
  FOREIGN KEY (ma_giam_gia_id) REFERENCES ma_giam_gia(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE don_hang_chi_tiet (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  don_hang_id BIGINT UNSIGNED NOT NULL,
  san_pham_id BIGINT UNSIGNED NOT NULL,
  bien_the_san_pham_id BIGINT UNSIGNED NULL,
  ten_san_pham_snapshot VARCHAR(255) NOT NULL,
  so_luong INT NOT NULL,
  don_gia DECIMAL(15,2) NOT NULL,
  thanh_tien DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id),
  FOREIGN KEY (bien_the_san_pham_id) REFERENCES bien_the_san_pham(id)
) ENGINE=InnoDB;

CREATE TABLE lich_su_trang_thai_don_hang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  don_hang_id BIGINT UNSIGNED NOT NULL,
  trang_thai VARCHAR(50) NOT NULL,
  ghi_chu VARCHAR(255) NULL,
  nhan_vien_id BIGINT UNSIGNED NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE phuong_thuc_thanh_toan (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten VARCHAR(100) NOT NULL,
  trang_thai BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE thanh_toan (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  don_hang_id BIGINT UNSIGNED NOT NULL,
  phuong_thuc_thanh_toan_id BIGINT UNSIGNED NOT NULL,
  so_tien DECIMAL(15,2) NOT NULL,
  ma_giao_dich VARCHAR(100) NULL,
  trang_thai ENUM('cho_thanh_toan','thanh_cong','that_bai','hoan_tien') DEFAULT 'cho_thanh_toan',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (phuong_thuc_thanh_toan_id) REFERENCES phuong_thuc_thanh_toan(id)
) ENGINE=InnoDB;

CREATE TABLE phuong_thuc_van_chuyen (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten VARCHAR(100) NOT NULL,
  phi_co_ban DECIMAL(15,2) DEFAULT 0,
  thoi_gian_du_kien VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE van_chuyen_don_hang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  don_hang_id BIGINT UNSIGNED NOT NULL UNIQUE,
  phuong_thuc_van_chuyen_id BIGINT UNSIGNED NOT NULL,
  ma_van_don VARCHAR(100) NULL,
  trang_thai_giao_hang VARCHAR(50) DEFAULT 'cho_lay_hang',
  ngay_giao_du_kien DATE NULL,
  FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (phuong_thuc_van_chuyen_id) REFERENCES phuong_thuc_van_chuyen(id)
) ENGINE=InnoDB;

-- =========================================================
-- 5. MARKETING / KHUYẾN MÃI
-- =========================================================

CREATE TABLE khuyen_mai (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten_chuong_trinh VARCHAR(200) NOT NULL,
  mo_ta TEXT,
  loai_giam ENUM('phan_tram','tien_mat') NOT NULL,
  gia_tri_giam DECIMAL(15,2) NOT NULL,
  ngay_bat_dau DATETIME NOT NULL,
  ngay_ket_thuc DATETIME NOT NULL,
  trang_thai BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE ap_dung_khuyen_mai (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  khuyen_mai_id BIGINT UNSIGNED NOT NULL,
  san_pham_id BIGINT UNSIGNED NULL,
  danh_muc_id BIGINT UNSIGNED NULL,
  FOREIGN KEY (khuyen_mai_id) REFERENCES khuyen_mai(id) ON DELETE CASCADE,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE,
  FOREIGN KEY (danh_muc_id) REFERENCES danh_muc_san_pham(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 6. TƯƠNG TÁC KHÁCH HÀNG
-- =========================================================

CREATE TABLE danh_gia_san_pham (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  san_pham_id BIGINT UNSIGNED NOT NULL,
  khach_hang_id BIGINT UNSIGNED NOT NULL,
  don_hang_chi_tiet_id BIGINT UNSIGNED NULL,
  so_sao TINYINT NOT NULL CHECK (so_sao BETWEEN 1 AND 5),
  tieu_de VARCHAR(200) NULL,
  noi_dung TEXT NULL,
  hinh_anh_dinh_kem JSON NULL,
  trang_thai_duyet ENUM('cho_duyet','da_duyet','tu_choi') DEFAULT 'cho_duyet',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE,
  FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (don_hang_chi_tiet_id) REFERENCES don_hang_chi_tiet(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE san_pham_yeu_thich (
  khach_hang_id BIGINT UNSIGNED NOT NULL,
  san_pham_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (khach_hang_id, san_pham_id),
  FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE thong_bao (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  khach_hang_id BIGINT UNSIGNED NOT NULL,
  tieu_de VARCHAR(200) NOT NULL,
  noi_dung TEXT,
  loai ENUM('don_hang','khuyen_mai','he_thong') DEFAULT 'he_thong',
  da_doc BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 7. NỘI DUNG & HỖ TRỢ
-- =========================================================

CREATE TABLE danh_muc_bai_viet (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten VARCHAR(150) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE bai_viet (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  danh_muc_bai_viet_id BIGINT UNSIGNED NULL,
  tieu_de VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  tom_tat VARCHAR(500),
  noi_dung LONGTEXT,
  anh_bia VARCHAR(255),
  tac_gia_id BIGINT UNSIGNED NULL,
  trang_thai ENUM('nhap','da_dang','an') DEFAULT 'nhap',
  ngay_xuat_ban DATETIME NULL,
  FOREIGN KEY (danh_muc_bai_viet_id) REFERENCES danh_muc_bai_viet(id) ON DELETE SET NULL,
  FOREIGN KEY (tac_gia_id) REFERENCES nhan_vien(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE cau_hoi_thuong_gap (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  danh_muc VARCHAR(100),
  cau_hoi VARCHAR(500) NOT NULL,
  cau_tra_loi TEXT NOT NULL,
  thu_tu INT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE yeu_cau_ho_tro (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  khach_hang_id BIGINT UNSIGNED NOT NULL,
  tieu_de VARCHAR(255) NOT NULL,
  noi_dung TEXT NOT NULL,
  loai_yeu_cau ENUM('ky_thuat','thanh_toan','khieu_nai','khac') DEFAULT 'khac',
  trang_thai ENUM('moi','dang_xu_ly','da_giai_quyet') DEFAULT 'moi',
  nhan_vien_xu_ly_id BIGINT UNSIGNED NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (nhan_vien_xu_ly_id) REFERENCES nhan_vien(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE phan_hoi_ho_tro (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  yeu_cau_ho_tro_id BIGINT UNSIGNED NOT NULL,
  nguoi_gui_id BIGINT UNSIGNED NOT NULL,
  nguoi_gui_loai ENUM('khach_hang','nhan_vien') NOT NULL,
  noi_dung TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (yeu_cau_ho_tro_id) REFERENCES yeu_cau_ho_tro(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- INDEX BỔ SUNG
-- =========================================================
CREATE INDEX idx_san_pham_danhmuc_trangthai ON san_pham(danh_muc_id, trang_thai);
CREATE INDEX idx_san_pham_loai ON san_pham(loai_san_pham);
CREATE INDEX idx_donhang_khachhang_trangthai ON don_hang(khach_hang_id, trang_thai_don_hang);
CREATE INDEX idx_danhgia_sanpham_duyet ON danh_gia_san_pham(san_pham_id, trang_thai_duyet);
