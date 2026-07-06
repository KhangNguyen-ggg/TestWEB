-- =========================================================
--  SEED DỮ LIỆU MẪU — website_vnpt
--  Chạy SAU khi đã import schema.sql.
--  Nội dung khớp với frontend: 8 dịch vụ (svc-001..svc-008),
--  3 gói bảng giá (pkg-basic/business/premium), tài khoản admin demo.
--
--  Mật khẩu admin demo: admin123
--  (hash bcrypt bên dưới tương ứng chuỗi "admin123")
-- =========================================================
USE website_vnpt;

-- ---------- 1. Vai trò & nhân viên (admin) ----------
INSERT INTO vai_tro (id, ten_vai_tro) VALUES
  (1, 'admin'),
  (2, 'nhan_vien')
ON DUPLICATE KEY UPDATE ten_vai_tro = VALUES(ten_vai_tro);

-- Tài khoản quản trị demo: email admin@vnvd.vn / mật khẩu admin123
-- Hash bcrypt của "admin123" (cost 10):
INSERT INTO nhan_vien (id, ho_ten, email, mat_khau_hash, vai_tro_id, trang_thai) VALUES
  (1, 'Quản trị viên', 'admin@vnvd.vn',
   '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4XY0uKuqk5m1oX8dM0hV7kQ6H2Fe', 1, 'hoat_dong')
ON DUPLICATE KEY UPDATE ho_ten = VALUES(ho_ten);

-- ---------- 2. Danh mục sản phẩm ----------
INSERT INTO danh_muc_san_pham (id, ten_danh_muc, slug, mo_ta, thu_tu_hien_thi, trang_thai) VALUES
  (1, 'Dịch vụ chuyển đổi số', 'dich-vu-chuyen-doi-so', 'Các dịch vụ hạ tầng số, bảo mật, cloud, AI...', 1, TRUE),
  (2, 'Gói bảng giá',          'goi-bang-gia',          'Các gói dịch vụ đóng gói theo quy mô doanh nghiệp', 2, TRUE)
ON DUPLICATE KEY UPDATE ten_danh_muc = VALUES(ten_danh_muc);

-- ---------- 3. Phương thức thanh toán & vận chuyển ----------
INSERT INTO phuong_thuc_thanh_toan (id, ten, trang_thai) VALUES
  (1, 'Thanh toán khi nhận hàng (COD)', TRUE),
  (2, 'Chuyển khoản ngân hàng', TRUE),
  (3, 'Ví điện tử / VNPAY', TRUE)
ON DUPLICATE KEY UPDATE ten = VALUES(ten);

INSERT INTO phuong_thuc_van_chuyen (id, ten, phi_co_ban, thoi_gian_du_kien) VALUES
  (1, 'Kích hoạt trực tuyến', 0, 'Trong 24h'),
  (2, 'Nhân viên tư vấn liên hệ', 0, '1-2 ngày làm việc')
ON DUPLICATE KEY UPDATE ten = VALUES(ten);

-- ---------- 4. Sản phẩm (dịch vụ) — khớp data-* của frontend ----------
-- ma_san_pham = id frontend (svc-001..svc-008, pkg-*); loai_san_pham=dich_vu_so/combo
-- gia_niem_yet = data-price. slug duy nhất.
INSERT INTO san_pham
  (ma_san_pham, ten_san_pham, slug, danh_muc_id, loai_san_pham, thuong_hieu, mo_ta_ngan, gia_niem_yet, don_vi_tinh, trang_thai)
VALUES
  ('svc-001', 'Cloud Computing',            'cloud-computing',           1, 'dich_vu_so', 'VNVD', 'Hạ tầng điện toán đám mây linh hoạt, mở rộng theo nhu cầu.',           2500000, 'tháng', 'dang_ban'),
  ('svc-002', 'Bảo mật & An toàn số',       'bao-mat-an-toan-so',        1, 'dich_vu_so', 'VNVD', 'Giải pháp bảo mật toàn diện, giám sát 24/7.',                          1800000, 'tháng', 'dang_ban'),
  ('svc-003', 'AI & Tự động hóa',           'ai-tu-dong-hoa',            1, 'dich_vu_so', 'VNVD', 'Ứng dụng trí tuệ nhân tạo tự động hóa quy trình nghiệp vụ.',           3200000, 'tháng', 'dang_ban'),
  ('svc-004', 'Hạ tầng mạng 5G',            'ha-tang-mang-5g',           1, 'dich_vu_so', 'VNVD', 'Kết nối 5G/SD-WAN tốc độ cao, độ trễ thấp cho doanh nghiệp.',          4500000, 'tháng', 'dang_ban'),
  ('svc-005', 'Quản trị doanh nghiệp số',   'quan-tri-doanh-nghiep-so',  1, 'dich_vu_so', 'VNVD', 'Nền tảng quản trị, điều hành doanh nghiệp trên môi trường số.',         990000, 'tháng', 'dang_ban'),
  ('svc-006', 'Giao tiếp & Cộng tác',       'giao-tiep-cong-tac',        1, 'dich_vu_so', 'VNVD', 'Hội họp trực tuyến, cộng tác nhóm bảo mật.',                            750000, 'tháng', 'dang_ban'),
  ('svc-007', 'Big Data & Phân tích',       'big-data-phan-tich',        1, 'dich_vu_so', 'VNVD', 'Thu thập, phân tích dữ liệu lớn hỗ trợ ra quyết định.',                2100000, 'tháng', 'dang_ban'),
  ('svc-008', 'IoT & Smart City',           'iot-smart-city',            1, 'dich_vu_so', 'VNVD', 'Kết nối vạn vật, giải pháp đô thị thông minh.',                        1500000, 'tháng', 'dang_ban'),
  ('pkg-basic',    'Gói Cơ bản',            'goi-co-ban',                2, 'combo',      'VNVD', 'Gói khởi đầu cho doanh nghiệp nhỏ.',                                    990000, 'tháng', 'dang_ban'),
  ('pkg-business', 'Gói Doanh nghiệp',      'goi-doanh-nghiep',          2, 'combo',      'VNVD', 'Gói phổ biến cho doanh nghiệp vừa.',                                   2900000, 'tháng', 'dang_ban'),
  ('pkg-premium',  'Gói Cao cấp',           'goi-cao-cap',               2, 'combo',      'VNVD', 'Giải pháp toàn diện cho tập đoàn lớn.',                                7500000, 'tháng', 'dang_ban')
ON DUPLICATE KEY UPDATE ten_san_pham = VALUES(ten_san_pham), gia_niem_yet = VALUES(gia_niem_yet);
