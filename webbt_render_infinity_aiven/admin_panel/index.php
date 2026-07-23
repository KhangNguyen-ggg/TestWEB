<?php
/**
 * index.php — Dashboard Admin Panel
 * Hiển thị thống kê tổng quan: số admin, khách hàng, hoạt động, bị khóa
 */

require_once __DIR__ . '/db.php';

// ── Thống kê ─────────────────────────────────────────────
$totalAdmins     = $pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn();
$activeAdmins    = $pdo->query("SELECT COUNT(*) FROM admins WHERE trang_thai='hoat_dong'")->fetchColumn();
$totalCustomers  = $pdo->query('SELECT COUNT(*) FROM customers')->fetchColumn();
$activeCustomers = $pdo->query("SELECT COUNT(*) FROM customers WHERE trang_thai='hoat_dong'")->fetchColumn();
$lockedCustomers = $pdo->query("SELECT COUNT(*) FROM customers WHERE trang_thai='khoa'")->fetchColumn();
$newThisMonth    = $pdo->query("SELECT COUNT(*) FROM customers WHERE MONTH(created_at)=MONTH(NOW()) AND YEAR(created_at)=YEAR(NOW())")->fetchColumn();

// 5 khách hàng mới nhất
$latestCustomers = $pdo->query('SELECT * FROM customers ORDER BY created_at DESC LIMIT 5')->fetchAll();
// 5 admin mới nhất
$latestAdmins    = $pdo->query('SELECT * FROM admins ORDER BY created_at DESC LIMIT 5')->fetchAll();

$pageTitle  = 'Dashboard';
$activeMenu = 'dashboard';
require_once __DIR__ . '/header.php';
?>

<!-- ── Stat cards ────────────────────────────────────────── -->
<div class="row g-3 mb-4">
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#1d4ed8,#60a5fa)">
            <i class="fa-solid fa-user-shield stat-icon"></i>
            <div class="stat-value"><?= $totalAdmins ?></div>
            <div class="stat-label">Tổng Quản trị viên</div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#7c3aed,#c084fc)">
            <i class="fa-solid fa-users stat-icon"></i>
            <div class="stat-value"><?= $totalCustomers ?></div>
            <div class="stat-label">Tổng Khách hàng</div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#059669,#34d399)">
            <i class="fa-solid fa-circle-check stat-icon"></i>
            <div class="stat-value"><?= $activeCustomers ?></div>
            <div class="stat-label">Khách hàng hoạt động</div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#d97706,#fbbf24)">
            <i class="fa-solid fa-user-plus stat-icon"></i>
            <div class="stat-value"><?= $newThisMonth ?></div>
            <div class="stat-label">Khách mới tháng này</div>
        </div>
    </div>
</div>

<!-- ── Quick actions ─────────────────────────────────────── -->
<div class="row g-3 mb-4">
    <div class="col-12">
        <div class="card">
            <div class="card-body d-flex flex-wrap gap-2 align-items-center">
                <span class="fw-semibold me-2">Thao tác nhanh:</span>
                <a href="admins.php" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-user-shield me-1"></i>Quản lý Admin
                </a>
                <a href="customers.php" class="btn btn-outline-primary btn-sm">
                    <i class="fa-solid fa-users me-1"></i>Quản lý Khách hàng
                </a>
                <a href="admins.php" class="btn btn-success btn-sm"
                   onclick="setTimeout(()=>document.querySelector('[data-bs-target=\'#modalAdd\']')?.click(),300)">
                    <i class="fa-solid fa-plus me-1"></i>Thêm Admin mới
                </a>
                <a href="customers.php" class="btn btn-outline-success btn-sm">
                    <i class="fa-solid fa-plus me-1"></i>Thêm Khách hàng
                </a>
            </div>
        </div>
    </div>
</div>

<!-- ── Bảng tóm tắt ──────────────────────────────────────── -->
<div class="row g-3">
    <!-- Khách hàng mới nhất -->
    <div class="col-lg-7">
        <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="fa-solid fa-users me-2 text-primary"></i>Khách hàng mới nhất</span>
                <a href="customers.php" class="btn btn-outline-primary btn-sm">Xem tất cả</a>
            </div>
            <div class="card-body p-0">
                <table class="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($latestCustomers as $c): ?>
                        <tr>
                            <td class="fw-medium"><?= htmlspecialchars($c['ho_ten']) ?></td>
                            <td style="font-size:13px"><?= htmlspecialchars($c['email']) ?></td>
                            <td>
                                <?php if ($c['trang_thai'] === 'hoat_dong'): ?>
                                    <span class="badge badge-hoat-dong">Hoạt động</span>
                                <?php else: ?>
                                    <span class="badge badge-khoa">Đã khóa</span>
                                <?php endif; ?>
                            </td>
                            <td class="text-muted" style="font-size:13px">
                                <?= date('d/m/Y', strtotime($c['created_at'])) ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Tóm tắt hệ thống -->
    <div class="col-lg-5">
        <div class="card h-100">
            <div class="card-header">
                <i class="fa-solid fa-chart-pie me-2 text-primary"></i>Tóm tắt hệ thống
            </div>
            <div class="card-body">
                <!-- Admin -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-semibold" style="font-size:14px">Quản trị viên hoạt động</span>
                        <span class="text-primary fw-bold"><?= $activeAdmins ?>/<?= $totalAdmins ?></span>
                    </div>
                    <div class="progress" style="height:8px;border-radius:4px">
                        <div class="progress-bar bg-primary" style="width:<?= $totalAdmins > 0 ? round($activeAdmins/$totalAdmins*100) : 0 ?>%"></div>
                    </div>
                </div>

                <!-- Khách hàng hoạt động -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-semibold" style="font-size:14px">Khách hàng hoạt động</span>
                        <span class="text-success fw-bold"><?= $activeCustomers ?>/<?= $totalCustomers ?></span>
                    </div>
                    <div class="progress" style="height:8px;border-radius:4px">
                        <div class="progress-bar bg-success" style="width:<?= $totalCustomers > 0 ? round($activeCustomers/$totalCustomers*100) : 0 ?>%"></div>
                    </div>
                </div>

                <!-- Khách hàng bị khóa -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-semibold" style="font-size:14px">Tài khoản bị khóa</span>
                        <span class="text-danger fw-bold"><?= $lockedCustomers ?></span>
                    </div>
                    <div class="progress" style="height:8px;border-radius:4px">
                        <div class="progress-bar bg-danger" style="width:<?= $totalCustomers > 0 ? round($lockedCustomers/$totalCustomers*100) : 0 ?>%"></div>
                    </div>
                </div>

                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted" style="font-size:13px">
                        <i class="fa-solid fa-clock me-1"></i>
                        Cập nhật: <?= date('H:i d/m/Y') ?>
                    </span>
                    <a href="index.php" class="btn btn-outline-secondary btn-sm">
                        <i class="fa-solid fa-rotate-right me-1"></i>Làm mới
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>
