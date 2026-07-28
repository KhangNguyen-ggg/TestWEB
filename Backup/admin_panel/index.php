<?php
$pageTitle  = 'Dashboard';
$activeMenu = 'dashboard';
require_once __DIR__ . '/header.php';
?>

<!-- ── Stat cards ────────────────────────────────────────── -->
<div class="row g-3 mb-4">
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#1d4ed8,#60a5fa)">
            <i class="fa-solid fa-user-shield stat-icon"></i>
            <div class="stat-value" id="valTotalAdmins">...</div>
            <div class="stat-label">Tổng Quản trị viên</div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#7c3aed,#c084fc)">
            <i class="fa-solid fa-users stat-icon"></i>
            <div class="stat-value" id="valTotalCustomers">...</div>
            <div class="stat-label">Tổng Khách hàng</div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#059669,#34d399)">
            <i class="fa-solid fa-circle-check stat-icon"></i>
            <div class="stat-value" id="valActiveCustomers">...</div>
            <div class="stat-label">Khách hàng hoạt động</div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#d97706,#fbbf24)">
            <i class="fa-solid fa-user-plus stat-icon"></i>
            <div class="stat-value" id="valNewThisMonth">...</div>
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
                    <tbody id="latestCustomersBody">
                        <tr>
                            <td colspan="4" class="text-center">Đang tải dữ liệu...</td>
                        </tr>
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
                        <!-- ĐÃ SỬA: Xóa PHP, thêm ID summaryAdmins -->
                        <span class="text-primary fw-bold" id="summaryAdmins">...</span>
                    </div>
                    <div class="progress" style="height:8px;border-radius:4px">
                        <!-- ĐÃ SỬA: Xóa PHP tính %, thêm ID progressAdmins -->
                        <div class="progress-bar bg-primary" id="progressAdmins" style="width:0%"></div>
                    </div>
                </div>

                <!-- Khách hàng hoạt động -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-semibold" style="font-size:14px">Khách hàng hoạt động</span>
                        <!-- ĐÃ SỬA: Xóa PHP, thêm ID summaryActiveCustomers -->
                        <span class="text-success fw-bold" id="summaryActiveCustomers">...</span>
                    </div>
                    <div class="progress" style="height:8px;border-radius:4px">
                        <!-- ĐÃ SỬA: Xóa PHP tính %, thêm ID progressActiveCustomers -->
                        <div class="progress-bar bg-success" id="progressActiveCustomers" style="width:0%"></div>
                    </div>
                </div>

                <!-- Khách hàng bị khóa -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-semibold" style="font-size:14px">Tài khoản bị khóa</span>
                        <!-- ĐÃ SỬA: Xóa PHP, thêm ID summaryLockedCustomers -->
                        <span class="text-danger fw-bold" id="summaryLockedCustomers">...</span>
                    </div>
                    <div class="progress" style="height:8px;border-radius:4px">
                        <!-- ĐÃ SỬA: Xóa PHP tính %, thêm ID progressLockedCustomers -->
                        <div class="progress-bar bg-danger" id="progressLockedCustomers" style="width:0%"></div>
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

<!-- ĐÃ SỬA: Bổ sung toàn bộ script để Fetch dữ liệu từ API thay vì dùng PDO -->
<script>
document.addEventListener('DOMContentLoaded', async () => {
    // Gọi class Api từ file frontend/js/api.js đã include ở header
    const Api = window.VNVDApi;
    if (!Api || !Api.getToken()) {
        alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn!");
        window.location.href = '../frontend/index.php';
        return;
    }

    try {
        // Dùng fetch trực tiếp gọi thẳng API của Backend Nodejs
        // Cần đảm bảo trên Backend (Nodejs) bạn đã tạo Endpoint: GET /api/admin/stats
        const response = await fetch(GLOBAL_API_URL + '/api/admin/stats', {
            headers: { 'Authorization': 'Bearer ' + Api.getToken() }
        });

        if (!response.ok) throw new Error("Không thể tải dữ liệu API");
        const data = await response.json();

        // 1. CẬP NHẬT 4 THẺ THỐNG KÊ (STAT CARDS)
        document.getElementById('valTotalAdmins').innerText = data.totalAdmins || 0;
        document.getElementById('valTotalCustomers').innerText = data.totalCustomers || 0;
        document.getElementById('valActiveCustomers').innerText = data.activeCustomers || 0;
        document.getElementById('valNewThisMonth').innerText = data.newThisMonth || 0;

        // 2. CẬP NHẬT "TÓM TẮT HỆ THỐNG" (TÍNH TOÁN PHẦN TRĂM THANH PROGRESS BAR)
        const tAdmins = data.totalAdmins || 0;
        const aAdmins = data.activeAdmins || 0;
        const tCust = data.totalCustomers || 0;
        const aCust = data.activeCustomers || 0;
        const lCust = data.lockedCustomers || 0;

        // Admin 
        document.getElementById('summaryAdmins').innerText = `${aAdmins}/${tAdmins}`;
        document.getElementById('progressAdmins').style.width = tAdmins > 0 ? Math.round((aAdmins / tAdmins) * 100) + '%' : '0%';

        // Khách hàng hoạt động
        document.getElementById('summaryActiveCustomers').innerText = `${aCust}/${tCust}`;
        document.getElementById('progressActiveCustomers').style.width = tCust > 0 ? Math.round((aCust / tCust) * 100) + '%' : '0%';

        // Khách hàng bị khóa
        document.getElementById('summaryLockedCustomers').innerText = lCust;
        document.getElementById('progressLockedCustomers').style.width = tCust > 0 ? Math.round((lCust / tCust) * 100) + '%' : '0%';

        // 3. CẬP NHẬT BẢNG KHÁCH HÀNG MỚI NHẤT (THAY THẾ FOREACH CỦA PHP)
        const tbody = document.getElementById('latestCustomersBody');
        if (!data.latestCustomers || data.latestCustomers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Chưa có khách hàng nào.</td></tr>';
        } else {
            let html = '';
            data.latestCustomers.forEach(c => {
                // Định dạng giao diện trạng thái
                let statusBadge = c.trang_thai === 'hoat_dong'
                    ? '<span class="badge badge-hoat-dong">Hoạt động</span>'
                    : '<span class="badge badge-khoa">Đã khóa</span>';

                // Định dạng ngày tháng
                let dateObj = new Date(c.created_at);
                let formattedDate = dateObj.toLocaleDateString('vi-VN');

                // Lắp ráp thẻ HTML tr
                html += `<tr>
                    <td class="fw-medium">${c.ho_ten}</td>
                    <td style="font-size:13px">${c.email}</td>
                    <td>${statusBadge}</td>
                    <td class="text-muted" style="font-size:13px">${formattedDate}</td>
                </tr>`;
            });
            tbody.innerHTML = html; // Đổ toàn bộ HTML vào khung
        }

    } catch (err) {
        console.error(err);
        document.getElementById('latestCustomersBody').innerHTML = '<tr><td colspan="4" class="text-center text-danger">Lỗi kết nối API lấy dữ liệu. Vui lòng thử lại!</td></tr>';
    }
});
</script>

<?php require_once __DIR__ . '/footer.php'; ?>