<?php
/**
 * header.php — Layout chung: <head> + Sidebar + Navbar
 * Include ở đầu mỗi trang: require_once 'header.php';
 *
 * Biến cần khai báo TRƯỚC khi include:
 *   $pageTitle  = 'Tên trang';          // Tiêu đề tab trình duyệt
 *   $activeMenu = 'admins';             // 'dashboard' | 'admins' | 'customers'
 */

// Xác định trang hiện tại để highlight menu
$activeMenu = $activeMenu ?? 'dashboard';
$pageTitle  = $pageTitle  ?? 'Admin Panel — VNVD';

// Đường dẫn tương đối đến thư mục admin_panel (dùng cho link)
$base = '';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?> | VNVD Admin</title>

    <!-- Bootstrap 5 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <!-- Font Awesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        /* ── Biến màu VNVD ─────────────────────────────── */
        :root {
            --vnvd-primary:   #0d6efd;
            --vnvd-dark:      #0a1628;
            --vnvd-sidebar:   #111827;
            --vnvd-sidebar-hover: #1f2937;
            --vnvd-sidebar-active: #1d4ed8;
            --vnvd-text-muted: #9ca3af;
            --sidebar-width:  260px;
        }

        /* ── Reset & Base ──────────────────────────────── */
        * { box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #f1f5f9;
            color: #1e293b;
            margin: 0;
        }

        /* ── Sidebar ───────────────────────────────────── */
        #sidebar {
            position: fixed;
            top: 0; left: 0;
            width: var(--sidebar-width);
            height: 100vh;
            background: var(--vnvd-sidebar);
            display: flex;
            flex-direction: column;
            z-index: 1040;
            transition: transform .3s ease;
            overflow-y: auto;
        }

        /* Logo */
        .sidebar-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 22px 20px 18px;
            border-bottom: 1px solid rgba(255,255,255,.08);
            text-decoration: none;
        }
        .sidebar-brand .brand-icon {
            width: 40px; height: 40px;
            background: var(--vnvd-primary);
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; color: #fff;
            flex-shrink: 0;
        }
        .sidebar-brand .brand-text { line-height: 1.2; }
        .sidebar-brand .brand-name {
            font-size: 16px; font-weight: 700;
            color: #fff; display: block;
        }
        .sidebar-brand .brand-sub {
            font-size: 11px; color: var(--vnvd-text-muted);
        }

        /* Nav */
        .sidebar-nav { padding: 16px 12px; flex: 1; }
        .nav-section-label {
            font-size: 10px; font-weight: 600;
            text-transform: uppercase; letter-spacing: .08em;
            color: var(--vnvd-text-muted);
            padding: 12px 8px 6px;
        }
        .sidebar-link {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px;
            border-radius: 8px;
            color: #d1d5db;
            text-decoration: none;
            font-size: 14px; font-weight: 500;
            transition: background .2s, color .2s;
            margin-bottom: 2px;
        }
        .sidebar-link i { width: 18px; text-align: center; font-size: 15px; }
        .sidebar-link:hover {
            background: var(--vnvd-sidebar-hover);
            color: #fff;
        }
        .sidebar-link.active {
            background: var(--vnvd-sidebar-active);
            color: #fff;
        }
        .sidebar-link .badge-count {
            margin-left: auto;
            background: rgba(255,255,255,.15);
            color: #fff;
            font-size: 11px;
            padding: 2px 7px;
            border-radius: 20px;
        }

        /* Sidebar footer */
        .sidebar-footer {
            padding: 14px 20px;
            border-top: 1px solid rgba(255,255,255,.08);
            font-size: 12px; color: var(--vnvd-text-muted);
        }

        /* ── Main content ──────────────────────────────── */
        #main-content {
            margin-left: var(--sidebar-width);
            min-height: 100vh;
            display: flex; flex-direction: column;
        }

        /* ── Top Navbar ────────────────────────────────── */
        .top-navbar {
            background: #fff;
            border-bottom: 1px solid #e2e8f0;
            padding: 0 24px;
            height: 64px;
            display: flex; align-items: center;
            position: sticky; top: 0; z-index: 1030;
            gap: 16px;
        }
        .top-navbar .page-title {
            font-size: 18px; font-weight: 600;
            color: #0f172a; flex: 1;
        }
        .top-navbar .btn-toggle-sidebar {
            display: none;
            background: none; border: none;
            font-size: 20px; color: #64748b;
            cursor: pointer; padding: 4px 8px;
        }
        .top-navbar .admin-avatar {
            width: 36px; height: 36px;
            background: var(--vnvd-primary);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-weight: 600; font-size: 14px;
            cursor: pointer;
        }
        .top-navbar .admin-info { line-height: 1.2; }
        .top-navbar .admin-info .name { font-size: 13px; font-weight: 600; }
        .top-navbar .admin-info .role { font-size: 11px; color: #64748b; }

        /* ── Page content wrapper ──────────────────────── */
        .page-content {
            padding: 28px 28px 40px;
            flex: 1;
        }

        /* ── Cards ─────────────────────────────────────── */
        .card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
        }
        .card-header {
            background: #fff;
            border-bottom: 1px solid #f1f5f9;
            border-radius: 12px 12px 0 0 !important;
            padding: 16px 20px;
            font-weight: 600;
        }

        /* ── Stat cards ─────────────────────────────────── */
        .stat-card {
            border-radius: 12px;
            padding: 20px;
            color: #fff;
            position: relative; overflow: hidden;
        }
        .stat-card .stat-icon {
            position: absolute; right: 16px; top: 16px;
            font-size: 40px; opacity: .2;
        }
        .stat-card .stat-value { font-size: 32px; font-weight: 700; }
        .stat-card .stat-label { font-size: 13px; opacity: .85; margin-top: 4px; }

        /* ── Table ──────────────────────────────────────── */
        .table thead th {
            background: #f8fafc;
            font-size: 12px; font-weight: 600;
            text-transform: uppercase; letter-spacing: .05em;
            color: #64748b;
            border-bottom: 2px solid #e2e8f0;
            padding: 12px 16px;
        }
        .table tbody td { padding: 12px 16px; vertical-align: middle; font-size: 14px; }
        .table tbody tr:hover { background: #f8fafc; }

        /* ── Badges ─────────────────────────────────────── */
        .badge-hoat-dong { background: #dcfce7; color: #166534; }
        .badge-khoa       { background: #fee2e2; color: #991b1b; }

        /* ── Buttons ────────────────────────────────────── */
        .btn-action { padding: 4px 10px; font-size: 12px; border-radius: 6px; }

        /* ── Alert ──────────────────────────────────────── */
        .alert { border-radius: 10px; font-size: 14px; }

        /* ── Responsive ─────────────────────────────────── */
        @media (max-width: 991.98px) {
            #sidebar { transform: translateX(-100%); }
            #sidebar.show { transform: translateX(0); }
            #main-content { margin-left: 0; }
            .top-navbar .btn-toggle-sidebar { display: block; }
            .sidebar-overlay {
                display: none;
                position: fixed; inset: 0;
                background: rgba(0,0,0,.5);
                z-index: 1039;
            }
            .sidebar-overlay.show { display: block; }
        }
    </style>
</head>
<body>

<!-- ── Sidebar ──────────────────────────────────────────── -->
<nav id="sidebar">
    <!-- Brand -->
    <a href="index.php" class="sidebar-brand">
        <div class="brand-icon"><i class="fa-solid fa-shield-halved"></i></div>
        <div class="brand-text">
            <span class="brand-name">VNVD Admin</span>
            <span class="brand-sub">Quản trị hệ thống</span>
        </div>
    </a>

    <!-- Nav links -->
    <div class="sidebar-nav">
        <div class="nav-section-label">Tổng quan</div>
        <a href="index.php"
           class="sidebar-link <?= $activeMenu === 'dashboard' ? 'active' : '' ?>">
            <i class="fa-solid fa-gauge-high"></i> Dashboard
        </a>

        <div class="nav-section-label">Quản lý</div>
        <a href="admins.php"
           class="sidebar-link <?= $activeMenu === 'admins' ? 'active' : '' ?>">
            <i class="fa-solid fa-user-shield"></i> Quản trị viên
        </a>
        <a href="customers.php"
           class="sidebar-link <?= $activeMenu === 'customers' ? 'active' : '' ?>">
            <i class="fa-solid fa-users"></i> Khách hàng
        </a>

        <div class="nav-section-label">Hệ thống</div>
        <a href="../frontend/index.php" target="_blank" class="sidebar-link">
            <i class="fa-solid fa-globe"></i> Xem website
            <i class="fa-solid fa-arrow-up-right-from-square ms-auto" style="font-size:10px;opacity:.5"></i>
        </a>
    </div>

    <!-- Footer -->
    <div class="sidebar-footer">
        <div>VNVD Admin Panel v1.0</div>
        <div style="margin-top:2px">PHP Native + MySQL (PDO)</div>
    </div>
</nav>

<!-- Overlay (mobile) -->
<div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

<!-- ── Main content ──────────────────────────────────────── -->
<div id="main-content">

    <!-- Top Navbar -->
    <header class="top-navbar">
        <button class="btn-toggle-sidebar" onclick="toggleSidebar()" title="Mở/đóng menu">
            <i class="fa-solid fa-bars"></i>
        </button>
        <div class="page-title"><?= htmlspecialchars($pageTitle) ?></div>

        <!-- Breadcrumb (desktop) -->
        <nav aria-label="breadcrumb" class="d-none d-md-block">
            <ol class="breadcrumb mb-0" style="font-size:13px">
                <li class="breadcrumb-item"><a href="index.php" class="text-decoration-none">Home</a></li>
                <?php if ($activeMenu !== 'dashboard'): ?>
                <li class="breadcrumb-item active"><?= htmlspecialchars($pageTitle) ?></li>
                <?php endif; ?>
            </ol>
        </nav>

        <!-- Admin info -->
        <div class="d-flex align-items-center gap-2">
            <div class="admin-info d-none d-sm-block text-end">
                <div class="name">Quản trị viên</div>
                <div class="role">Super Admin</div>
            </div>
            <div class="admin-avatar" title="Admin">A</div>
        </div>
    </header>

    <!-- Page content starts here -->
    <main class="page-content">

<!-- ── JS toggle sidebar (mobile) ───────────────────────── -->
<script>
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebarOverlay').classList.toggle('show');
}
</script>
