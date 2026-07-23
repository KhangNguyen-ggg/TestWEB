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
-- Thêm các menu cấp 1 (Menu cha)
INSERT INTO menu (id, ten_menu, slug, link, thu_tu) VALUES
(1, 'Về chúng tôi', 'gioi-thieu', '#', 1),
(2, 'Dịch vụ', 'cloud-computing', '#', 2),
(3, 'Giải pháp', 'gp-sme', '#', 3),
(4, 'Bảng giá', '', '#pricing', 4),
(5, 'Hệ sinh thái', 'he-sinh-thai', '#', 5),
(6, 'Tin tức', 'thong-cao-bao-chi', '#', 6),
(7, 'Đối tác', 'doi-tac', '#', 7),
(8, 'Liên hệ', '', '#contact', 8);

-- Thêm các menu cấp 2 (Menu con)
INSERT INTO menu (ten_menu, slug, link, menu_cha_id, thu_tu) VALUES
('Giới thiệu', 'gioi-thieu', '#', 1, 1),
('Tầm nhìn & Sứ mệnh', 'tam-nhin-su-menh', '#', 1, 2),
('Đội ngũ lãnh đạo', 'doi-ngu-lanh-dao', '#', 1, 3),
('Thành tựu', 'thanh-tuu', '#', 1, 4),

('Hạ tầng số', 'ha-tang-so', '#', 2, 1),
('Bảo mật & An toàn', 'bao-mat-an-toan', '#', 2, 2),
('Cloud Computing', 'cloud-computing', '#', 2, 3),
('AI & Tự động hóa', 'ai-tu-dong-hoa', '#', 2, 4),

('Doanh nghiệp vừa & nhỏ', 'gp-sme', '#', 3, 1),
('Tập đoàn lớn', 'gp-enterprise', '#', 3, 2),
('Chính phủ số', 'gp-chinh-phu', '#', 3, 3),
('Y tế & Giáo dục', 'gp-yte-giaoduc', '#', 3, 4),

('Thông cáo báo chí', 'thong-cao-bao-chi', '#', 6, 1),
('Blog công nghệ', 'blog-cong-nghe', '#', 6, 2),
('Sự kiện', 'su-kien', '#', 6, 3);
INSERT INTO trang_tinh (slug, tieu_de, mo_ta, icon) 
VALUES 
    -- Trang Giới thiệu
    ('gioi-thieu', 'Giới thiệu về VNVD', 'Nền tảng dịch vụ số toàn diện, đồng hành cùng doanh nghiệp Việt Nam trên hành trình chuyển đổi số.', 'building'),

    -- Nhóm Về chúng tôi
    ('tam-nhin-su-menh', 'Tầm nhìn & Sứ mệnh', 'Mục tiêu trở thành đầu tàu dẫn dắt công cuộc chuyển đổi số quốc gia, mang lại giá trị thiết thực và bền vững cho cộng đồng.', 'target'),
    ('doi-ngu-lanh-dao', 'Đội ngũ lãnh đạo', 'Những chuyên gia hàng đầu với hàng chục năm kinh nghiệm trong lĩnh vực công nghệ thông tin và viễn thông tại Việt Nam.', 'users'),
    ('thanh-tuu', 'Thành tựu nổi bật', 'Hơn 30 năm phát triển với hàng loạt giải thưởng danh giá trong nước và quốc tế về đổi mới công nghệ và dịch vụ xuất sắc.', 'award'),

    -- Nhóm Dịch vụ
    ('ha-tang-so', 'Hạ tầng số hiện đại', 'Nền tảng hạ tầng công nghệ vững chắc, đáp ứng mọi nhu cầu mở rộng, lưu trữ và phát triển tốc độ cao của doanh nghiệp.', 'server'),
    ('bao-mat-an-toan', 'Bảo mật & An toàn thông tin', 'Hệ thống phòng thủ đa lớp, bảo vệ dữ liệu doanh nghiệp an toàn tuyệt đối trước mọi rủi ro và tấn công trên không gian mạng.', 'shield-check'),
    ('cloud-computing', 'Cloud Computing', 'Triển khai hạ tầng đám mây linh hoạt, giúp tối ưu hóa chi phí vận hành và tăng cường khả năng mở rộng không giới hạn.', 'cloud'),
    ('ai-tu-dong-hoa', 'AI & Tự động hóa', 'Ứng dụng trí tuệ nhân tạo tiên tiến để tối ưu hóa quy trình vận hành, phân tích dữ liệu và nâng cao hiệu suất làm việc.', 'cpu'),

    -- Nhóm Giải pháp
    ('gp-sme', 'Giải pháp cho Doanh nghiệp vừa & nhỏ', 'Hệ sinh thái công nghệ được thiết kế tinh gọn, tối ưu chi phí nhưng vẫn đảm bảo tính năng toàn diện cho các SME.', 'briefcase'),
    ('gp-enterprise', 'Giải pháp cho Tập đoàn lớn', 'Hệ thống hạ tầng và phần mềm quản trị quy mô lớn, đáp ứng độ phức tạp cao, chuẩn hóa quy trình cho các tập đoàn đa quốc gia.', 'building-2'),
    ('gp-chinh-phu', 'Chính phủ số', 'Đồng hành xây dựng hệ thống chính phủ điện tử minh bạch, an toàn, hiệu quả nhằm phục vụ người dân và doanh nghiệp tốt hơn.', 'landmark'),
    ('gp-yte-giaoduc', 'Chuyển đổi số Y tế & Giáo dục', 'Cung cấp nền tảng số hóa hồ sơ bệnh án, quản lý trường học thông minh, mang lại tiện ích hiện đại cho toàn xã hội.', 'heart-pulse'),

    -- Nhóm Khác
    ('he-sinh-thai', 'Hệ sinh thái VNVD', 'Sự kết nối hoàn hảo giữa các giải pháp công nghệ, tạo nên một vòng tuần hoàn khép kín hỗ trợ tối đa cho doanh nghiệp.', 'network'),
    ('doi-tac', 'Đối tác chiến lược', 'Đồng hành cùng các tập đoàn công nghệ hàng đầu thế giới để mang lại những sản phẩm, giải pháp tối ưu và đột phá nhất.', 'handshake');