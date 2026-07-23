<?php
// URL API của backend trên Render
$apiUrl = 'https://testweb-3dku.onrender.com/api/menus';

// 1. Gọi API
$response = @file_get_contents($apiUrl);

// 2. Xử lý lỗi nếu không kết nối được server Render
if ($response === false) {
  die("<div style='padding: 20px; color: red; font-weight: bold;'>Lỗi nghiêm trọng: Không thể kết nối đến máy chủ API (Render) để tải Menu. Vui lòng kiểm tra lại backend.</div>");
}

$parsed = json_decode($response, true);

// 3. Xử lý lỗi nếu dữ liệu trả về không phải JSON
if (json_last_error() !== JSON_ERROR_NONE) {
  die("<div style='padding: 20px; color: red; font-weight: bold;'>Lỗi nghiêm trọng: Dữ liệu Menu từ API trả về không hợp lệ.</div>");
}

// Lấy mảng data từ JSON
$menus = $parsed['data'] ?? [];

// 4. Xử lý lỗi nếu database chưa có menu nào
if (empty($menus)) {
  die("<div style='padding: 20px; color: red; font-weight: bold;'>Lỗi: Danh sách menu trống. Hãy kiểm tra lại Database (bảng `menu`).</div>");
}

$menuTree = [];

// Nhóm các menu lại theo menu_cha_id để tạo dropdown
foreach ($menus as $menu) {
  $parentId = $menu['menu_cha_id'] === null ? 0 : $menu['menu_cha_id'];
  $menuTree[$parentId][] = $menu;
}

function renderMenuHTML($menuTree, $parentId = 0)
{
  if (!isset($menuTree[$parentId])) return '';

  $html = '';
  foreach ($menuTree[$parentId] as $item) {
    $hasChild = isset($menuTree[$item['id']]);
    $link = !empty($item['link']) ? $item['link'] : '#';
    $dataPage = !empty($item['slug']) ? ' data-page="' . htmlspecialchars($item['slug']) . '"' : '';

    if ($parentId == 0) {
      if ($hasChild) {
        $html .= '<div class="nav-item dropdown">';
        $html .= '<a href="' . $link . '" class="nav-link"' . $dataPage . '>' . htmlspecialchars($item['ten_menu']) . ' <i data-lucide="chevron-down" class="icon-sm"></i></a>';
        $html .= '<div class="dropdown-menu">';
        $html .= renderMenuHTML($menuTree, $item['id']);
        $html .= '</div>';
        $html .= '</div>';
      } else {
        $html .= '<a href="' . $link . '" class="nav-link"' . $dataPage . '>' . htmlspecialchars($item['ten_menu']) . '</a>';
      }
    } else {
      $html .= '<a href="' . $link . '"' . $dataPage . '>' . htmlspecialchars($item['ten_menu']) . '</a>';
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
        <!-- Sửa href="#" thành "index.php" để click vào logo thì về trang chủ -->
        <a href="index.php" class="nav-logo">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="url(#logoGrad)" />
              <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="white" opacity="0.9" />
              <circle cx="16" cy="16" r="4" fill="white" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#0066CC" />
                  <stop offset="100%" stop-color="#00AAFF" />
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
          <!-- Sửa href="#" thành "index.php" để click vào logo thì về trang chủ -->
          <button class="tb-btn btn-cart" id="cartToggle" aria-label="Giỏ hàng">
            <i data-lucide="shopping-cart"></i>
            <span class="tb-btn-label">Giỏ hàng</span>
            <span class="cart-badge" id="cartBadge" style="display:none">0</span>
          </button>

          <!-- NÚT ADMIN NỔI BẬT (Thêm mới vào đây) -->
          <!-- <a href="admin_panel/index.php" class="tb-btn" id="openAdminBtn" style="display:none; background: #FF6B00; color: white; border-radius: 8px; padding: 0 15px; text-decoration: none; margin-left: 10px;">
            <i data-lucide="layout-dashboard" style="color: white;"></i>
            <span class="tb-btn-label" style="margin-left: 5px; font-weight: bold;">Vào Quản Trị</span>
        </a>-->

          <button class="tb-btn" id="openAdminBtn" style="display:none; background: #FF6B00; color: white; border-radius: 8px; padding: 0 15px; border: none; cursor: pointer; margin-left: 10px;">
            <i data-lucide="layout-dashboard" style="color: white;"></i>
            <span class="tb-btn-label" style="margin-left: 5px; font-weight: bold;">Vào Quản Trị</span>
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