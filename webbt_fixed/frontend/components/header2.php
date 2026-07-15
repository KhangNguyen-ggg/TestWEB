<?php
// Gọi API từ Render
$apiUrl = 'https://deploy-web-g27w.onrender.com/api/menus';
$response = @file_get_contents($apiUrl);
$menus = [];

if ($response !== false) {
    $parsed = json_decode($response, true);
    // Tương thích với các định dạng trả về khác nhau ({"data": [...]} hoặc trực tiếp [...])
    $menus = $parsed['data'] ?? $parsed ?? [];
}

// NẾU API LỖI HOẶC CHƯA CÓ, SỬ DỤNG DỮ LIỆU DỰ PHÒNG (FALLBACK) ĐỂ MENU KHÔNG BỊ TRỐNG
if (empty($menus)) {
    $menus = [
        ['id' => 1, 'ten_menu' => 'Về chúng tôi', 'slug' => 'gioi-thieu', 'link' => '#', 'menu_cha_id' => null],
        ['id' => 2, 'ten_menu' => 'Dịch vụ', 'slug' => 'cloud-computing', 'link' => '#', 'menu_cha_id' => null],
        ['id' => 3, 'ten_menu' => 'Giải pháp', 'slug' => 'gp-sme', 'link' => '#', 'menu_cha_id' => null],
        ['id' => 4, 'ten_menu' => 'Bảng giá', 'slug' => '', 'link' => '#pricing', 'menu_cha_id' => null],
        ['id' => 5, 'ten_menu' => 'Hệ sinh thái', 'slug' => 'he-sinh-thai', 'link' => '#', 'menu_cha_id' => null],
        ['id' => 6, 'ten_menu' => 'Tin tức', 'slug' => 'thong-cao-bao-chi', 'link' => '#', 'menu_cha_id' => null],
        ['id' => 7, 'ten_menu' => 'Đối tác', 'slug' => 'doi-tac', 'link' => '#', 'menu_cha_id' => null],
        ['id' => 8, 'ten_menu' => 'Liên hệ', 'slug' => '', 'link' => '#contact', 'menu_cha_id' => null],
        // Menu con
        ['id' => 9, 'ten_menu' => 'Giới thiệu', 'slug' => 'gioi-thieu', 'link' => '#', 'menu_cha_id' => 1],
        ['id' => 10, 'ten_menu' => 'Tầm nhìn & Sứ mệnh', 'slug' => 'tam-nhin-su-menh', 'link' => '#', 'menu_cha_id' => 1],
        ['id' => 11, 'ten_menu' => 'Đội ngũ lãnh đạo', 'slug' => 'doi-ngu-lanh-dao', 'link' => '#', 'menu_cha_id' => 1],
        ['id' => 12, 'ten_menu' => 'Thành tựu', 'slug' => 'thanh-tuu', 'link' => '#', 'menu_cha_id' => 1],
        ['id' => 13, 'ten_menu' => 'Hạ tầng số', 'slug' => 'ha-tang-so', 'link' => '#', 'menu_cha_id' => 2],
        ['id' => 14, 'ten_menu' => 'Bảo mật & An toàn', 'slug' => 'bao-mat-an-toan', 'link' => '#', 'menu_cha_id' => 2],
        ['id' => 15, 'ten_menu' => 'Cloud Computing', 'slug' => 'cloud-computing', 'link' => '#', 'menu_cha_id' => 2],
        ['id' => 16, 'ten_menu' => 'AI & Tự động hóa', 'slug' => 'ai-tu-dong-hoa', 'link' => '#', 'menu_cha_id' => 2],
        ['id' => 17, 'ten_menu' => 'Doanh nghiệp vừa & nhỏ', 'slug' => 'gp-sme', 'link' => '#', 'menu_cha_id' => 3],
        ['id' => 18, 'ten_menu' => 'Tập đoàn lớn', 'slug' => 'gp-enterprise', 'link' => '#', 'menu_cha_id' => 3],
        ['id' => 19, 'ten_menu' => 'Chính phủ số', 'slug' => 'gp-chinh-phu', 'link' => '#', 'menu_cha_id' => 3],
        ['id' => 20, 'ten_menu' => 'Y tế & Giáo dục', 'slug' => 'gp-yte-giaoduc', 'link' => '#', 'menu_cha_id' => 3],
        ['id' => 21, 'ten_menu' => 'Thông cáo báo chí', 'slug' => 'thong-cao-bao-chi', 'link' => '#', 'menu_cha_id' => 6],
        ['id' => 22, 'ten_menu' => 'Blog công nghệ', 'slug' => 'blog-cong-nghe', 'link' => '#', 'menu_cha_id' => 6],
        ['id' => 23, 'ten_menu' => 'Sự kiện', 'slug' => 'su-kien', 'link' => '#', 'menu_cha_id' => 6],
    ];
}

$menuTree = [];
foreach ($menus as $menu) {
    $parentId = $menu['menu_cha_id'] === null ? 0 : $menu['menu_cha_id'];
    $menuTree[$parentId][] = $menu;
}

function renderMenuHTML($menuTree, $parentId = 0) {
    if (!isset($menuTree[$parentId])) return '';

    $html = '';
    foreach ($menuTree[$parentId] as $item) {
        $hasChild = isset($menuTree[$item['id']]);
        $link = !empty($item['link']) ? $item['link'] : '#';
        $dataPage = !empty($item['slug']) ? ' data-page="' . htmlspecialchars($item['slug']) . '"' : '';

        if ($parentId == 0) {
            if ($hasChild) {
                $html .= '<div class="nav-item dropdown">';
                $html .= '<a href="'.$link.'" class="nav-link"'.$dataPage.'>'.htmlspecialchars($item['ten_menu']).' <i data-lucide="chevron-down" class="icon-sm"></i></a>';
                $html .= '<div class="dropdown-menu">';
                $html .= renderMenuHTML($menuTree, $item['id']);
                $html .= '</div>';
                $html .= '</div>';
            } else {
                $html .= '<a href="'.$link.'" class="nav-link"'.$dataPage.'>'.htmlspecialchars($item['ten_menu']).'</a>';
            }
        } else {
            $html .= '<a href="'.$link.'"'.$dataPage.'>'.htmlspecialchars($item['ten_menu']).'</a>';
        }
    }
    return $html;
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VNVD – Dịch Vụ Số Toàn Diện</title>
  <link rel="stylesheet" href="assets/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
</head>
<body>

<div id="particles-bg"></div>

<header class="site-header" id="navbar">

  <div class="top-bar">
    <div class="top-bar-container">
      <a href="index.php" class="nav-logo">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="url(#logoGrad)"/>
            <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="white" opacity="0.9"/>
            <circle cx="16" cy="16" r="4" fill="white"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#0066CC"/>
                <stop offset="100%" stop-color="#00AAFF"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">VNVD</span>
      </a>

      <span class="top-bar-slogan">Chuyển đổi số – Vươn tầm thế giới</span>

      <div class="top-bar-actions">
        <button class="tb-btn btn-search" aria-label="Tìm kiếm">
          <i data-lucide="search"></i>
          <span class="tb-btn-label">Tìm kiếm</span>
        </button>

        <a href="#" class="tb-btn btn-lang">
          <i data-lucide="globe" class="icon-sm"></i>
          <span class="tb-btn-label">VI</span>
        </a>

        <button class="tb-btn btn-cart" id="cartToggle" aria-label="Giỏ hàng">
          <i data-lucide="shopping-cart"></i>
          <span class="tb-btn-label">Giỏ hàng</span>
          <span class="cart-badge" id="cartBadge" style="display:none">0</span>
        </button>

        <div class="tb-divider"></div>

        <div class="auth-btns" id="authBtns">
          <button class="btn-login" id="openLogin">Đăng nhập</button>
          <button class="btn-register" id="openRegister">Đăng ký</button>
        </div>

        <div class="user-menu" id="userMenu" style="display:none">
          <button class="user-avatar-btn" id="userAvatarBtn">
            <span class="user-avatar-circle" id="userAvatarCircle">U</span>
            <span class="user-display-name" id="userDisplayName">Người dùng</span>
            <i data-lucide="chevron-down" class="icon-sm"></i>
          </button>
          <div class="user-dropdown" id="userDropdown">
            <div class="user-dropdown-header">
              <span id="userDropdownName">Người dùng</span>
              <span id="userDropdownEmail" class="user-dropdown-email"></span>
            </div>
            <a href="#" class="user-dropdown-item"><i data-lucide="user"></i> Hồ sơ cá nhân</a>
            <a href="#" class="user-dropdown-item"><i data-lucide="package"></i> Đơn hàng của tôi</a>
            <a href="#" class="user-dropdown-item"><i data-lucide="settings"></i> Cài đặt</a>
            <button class="user-dropdown-item admin-only admin-entry" id="openAdminBtn"><i data-lucide="layout-dashboard"></i> Quản trị hệ thống</button>
            <div class="user-dropdown-divider"></div>
            <button class="user-dropdown-item logout-btn" id="logoutBtn"><i data-lucide="log-out"></i> Đăng xuất</button>
          </div>
        </div>

        <div class="tb-divider"></div>

        <a href="#contact" class="btn-cta">
          <i data-lucide="phone" style="width:15px;height:15px;"></i>
          Liên hệ ngay
        </a>
      </div>

      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <div class="nav-bar">
    <div class="nav-bar-container">
      <nav class="nav-links" id="navLinks">
        <?php echo renderMenuHTML($menuTree, 0); ?>
      </nav>

      <div class="nav-bar-right">
        <i data-lucide="phone-call" style="width:15px;height:15px;color:#fff;"></i>
        <span>Hotline: <strong>1800 1260</strong></span>
      </div>
    </div>
  </div>

</header>