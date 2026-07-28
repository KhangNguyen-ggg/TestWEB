<?php
// ĐÃ SỬA: Xóa toàn bộ khối PHP xử lý POST (Thêm/Sửa/Xóa) và GET (Lấy danh sách bằng PDO) ở trên cùng.
// Giờ PHP chỉ làm nhiệm vụ load giao diện.
$pageTitle  = 'Quản lý Quản trị viên';
$activeMenu = 'admins';
require_once __DIR__ . '/header.php';
?>

<!-- ── Thống kê nhanh ─────────────────────────────────── -->
<div class="row g-3 mb-4">
    <div class="col-sm-4">
        <div class="stat-card" style="background:linear-gradient(135deg,#1d4ed8,#3b82f6)">
            <i class="fa-solid fa-user-shield stat-icon"></i>
            <!-- ĐÃ SỬA: Thêm id để JS đổ số liệu -->
            <div class="stat-value" id="valTotal">...</div>
            <div class="stat-label">Tổng quản trị viên</div>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="stat-card" style="background:linear-gradient(135deg,#059669,#34d399)">
            <i class="fa-solid fa-circle-check stat-icon"></i>
            <div class="stat-value" id="valActive">...</div>
            <div class="stat-label">Đang hoạt động</div>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="stat-card" style="background:linear-gradient(135deg,#dc2626,#f87171)">
            <i class="fa-solid fa-lock stat-icon"></i>
            <div class="stat-value" id="valLocked">...</div>
            <div class="stat-label">Đã khóa</div>
        </div>
    </div>
</div>

<!-- ── Card danh sách ────────────────────────────────────── -->
<div class="card">
    <div class="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <span><i class="fa-solid fa-user-shield me-2 text-primary"></i>Danh sách Quản trị viên</span>
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalAdd">
            <i class="fa-solid fa-plus me-1"></i> Thêm Admin
        </button>
    </div>

    <!-- Bộ lọc / Tìm kiếm -->
    <div class="card-body border-bottom pb-3">
        <!-- ĐÃ SỬA: Bỏ method="GET", đổi thành bắt sự kiện submit bằng JS để không bị load lại trang -->
        <form id="filterForm" onsubmit="event.preventDefault(); loadAdmins();" class="row g-2 align-items-end">
            <div class="col-sm-5">
                <label class="form-label small fw-semibold mb-1">Tìm kiếm</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text"><i class="fa-solid fa-search"></i></span>
                    <input type="text" id="searchQ" class="form-control" placeholder="Họ tên hoặc email...">
                </div>
            </div>
            <div class="col-sm-3">
                <label class="form-label small fw-semibold mb-1">Vai trò</label>
                <select id="filterRole" class="form-select form-select-sm">
                    <option value="">-- Tất cả --</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                </select>
            </div>
            <div class="col-sm-2">
                <label class="form-label small fw-semibold mb-1">Trạng thái</label>
                <select id="filterStatus" class="form-select form-select-sm">
                    <option value="">-- Tất cả --</option>
                    <option value="hoat_dong">Hoạt động</option>
                    <option value="khoa">Đã khóa</option>
                </select>
            </div>
            <div class="col-sm-2 d-flex gap-1">
                <button type="submit" class="btn btn-primary btn-sm flex-fill">
                    <i class="fa-solid fa-filter me-1"></i>Lọc
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" title="Xóa bộ lọc" onclick="resetFilters()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </form>
    </div>

    <!-- Bảng dữ liệu -->
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead>
                    <tr>
                        <th style="width:50px">#</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th style="width:160px">Thao tác</th>
                    </tr>
                </thead>
                <!-- ĐÃ SỬA: Khung rỗng để JS nhét dữ liệu vào -->
                <tbody id="adminTableBody">
                    <tr><td colspan="7" class="text-center py-4">Đang tải dữ liệu...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- ══════════════════════════════════════════════════════ -->
<!-- Modal THÊM Admin                                       -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="modal fade" id="modalAdd" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <!-- ĐÃ SỬA: Đổi sang form submit bằng JS -->
            <form id="formAddAdmin" onsubmit="event.preventDefault(); submitAddAdmin();">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa-solid fa-user-plus text-primary me-2"></i>Thêm Quản trị viên
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Họ và tên <span class="text-danger">*</span></label>
                        <input type="text" id="addHoTen" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                        <input type="email" id="addEmail" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Mật khẩu <span class="text-danger">*</span></label>
                        <input type="password" id="addMatKhau" class="form-control" required minlength="6">
                    </div>
                    <div class="row g-3">
                        <div class="col-6">
                            <label class="form-label fw-semibold">Vai trò</label>
                            <select id="addVaiTro" class="form-select">
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                                <option value="editor">Editor</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold">Trạng thái</label>
                            <select id="addTrangThai" class="form-select">
                                <option value="hoat_dong">Hoạt động</option>
                                <option value="khoa">Khóa</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button type="submit" class="btn btn-primary"><i class="fa-solid fa-plus me-1"></i>Thêm</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- ══════════════════════════════════════════════════════ -->
<!-- Modal SỬA Admin                                        -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="modal fade" id="modalEdit" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <!-- ĐÃ SỬA: Đổi sang form submit bằng JS -->
            <form id="formEditAdmin" onsubmit="event.preventDefault(); submitEditAdmin();">
                <input type="hidden" id="editId">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa-solid fa-pen text-warning me-2"></i>Sửa Quản trị viên
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Họ và tên <span class="text-danger">*</span></label>
                        <input type="text" id="editHoTen" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                        <input type="email" id="editEmail" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Mật khẩu mới</label>
                        <input type="password" id="editMatKhau" class="form-control" placeholder="Để trống = giữ nguyên mật khẩu cũ" minlength="6">
                    </div>
                    <div class="row g-3">
                        <div class="col-6">
                            <label class="form-label fw-semibold">Vai trò</label>
                            <select id="editVaiTro" class="form-select">
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                                <option value="editor">Editor</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold">Trạng thái</label>
                            <select id="editTrangThai" class="form-select">
                                <option value="hoat_dong">Hoạt động</option>
                                <option value="khoa">Khóa</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button type="submit" class="btn btn-warning text-white"><i class="fa-solid fa-floppy-disk me-1"></i>Lưu</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- ── JAVASCRIPT XỬ LÝ API ─────────────────────────────── -->
<script>
const Api = window.VNVDApi;

// Khởi chạy khi load trang
document.addEventListener('DOMContentLoaded', () => {
    if (!Api || !Api.getToken()) {
        alert("Vui lòng đăng nhập!");
        window.location.href = '../frontend/index.php';
        return;
    }
    loadAdmins();
});

// Hàm reset bộ lọc
function resetFilters() {
    document.getElementById('filterForm').reset();
    loadAdmins();
}

// 1. LẤY DANH SÁCH & THỐNG KÊ (GET)
async function loadAdmins() {
    const q = document.getElementById('searchQ').value;
    const role = document.getElementById('filterRole').value;
    const status = document.getElementById('filterStatus').value;
    
    // Tạo query string
    const query = new URLSearchParams({ q, role, status }).toString();
    
    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/users?${query}`, {
            headers: { 'Authorization': 'Bearer ' + Api.getToken() }
        });
        const data = await res.json();
        
        // Đổ số liệu thống kê
        document.getElementById('valTotal').innerText = data.stats?.total || 0;
        document.getElementById('valActive').innerText = data.stats?.active || 0;
        document.getElementById('valLocked').innerText = data.stats?.locked || 0;

        // Vẽ bảng HTML
        const tbody = document.getElementById('adminTableBody');
        if (!data.users || data.users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Không tìm thấy quản trị viên nào.</td></tr>';
            return;
        }

        let html = '';
        data.users.forEach((a, i) => {
            const letter = a.ho_ten ? a.ho_ten.charAt(0).toUpperCase() : 'U';
            
            // Xử lý Role Badge
            let roleLabel = a.vai_tro; let roleColor = 'secondary';
            if(a.vai_tro === 'superadmin') { roleLabel = 'Super Admin'; roleColor = 'danger'; }
            if(a.vai_tro === 'admin') { roleLabel = 'Admin'; roleColor = 'primary'; }

            // Xử lý Status Badge
            const statusHtml = a.trang_thai === 'hoat_dong' 
                ? `<span class="badge badge-hoat-dong"><i class="fa-solid fa-circle-check me-1"></i>Hoạt động</span>`
                : `<span class="badge badge-khoa"><i class="fa-solid fa-lock me-1"></i>Đã khóa</span>`;
                
            const dateStr = new Date(a.created_at).toLocaleDateString('vi-VN');
            const safeObj = JSON.stringify(a).replace(/"/g, '&quot;'); // Để ném an toàn vào hàm openEditModal

            html += `<tr>
                <td class="text-muted">${i + 1}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div style="width:32px;height:32px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-weight:700;color:#1d4ed8;font-size:13px;">${letter}</div>
                        <span class="fw-medium">${a.ho_ten}</span>
                    </div>
                </td>
                <td>${a.email}</td>
                <td><span class="badge bg-${roleColor}">${roleLabel}</span></td>
                <td>${statusHtml}</td>
                <td class="text-muted" style="font-size:13px">${dateStr}</td>
                <td>
                    <button class="btn btn-outline-primary btn-action me-1" onclick="openEditModal(${safeObj})" title="Sửa"><i class="fa-solid fa-pen"></i></button>
                    
                    <button class="btn btn-action ${a.trang_thai === 'hoat_dong' ? 'btn-outline-warning' : 'btn-outline-success'}" 
                        onclick="toggleStatus(${a.id}, '${a.trang_thai === 'hoat_dong' ? 'khoa' : 'hoat_dong'}')" title="Khóa/Mở Khóa">
                        <i class="fa-solid ${a.trang_thai === 'hoat_dong' ? 'fa-lock' : 'fa-lock-open'}"></i>
                    </button>
                    
                    <button class="btn btn-outline-danger btn-action" onclick="deleteAdmin(${a.id})" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
        
    } catch (err) {
        document.getElementById('adminTableBody').innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi tải dữ liệu.</td></tr>';
    }
}

// 2. THÊM ADMIN MỚI (POST)
async function submitAddAdmin() {
    const payload = {
        ho_ten: document.getElementById('addHoTen').value,
        email: document.getElementById('addEmail').value,
        mat_khau: document.getElementById('addMatKhau').value,
        vai_tro: document.getElementById('addVaiTro').value,
        trang_thai: document.getElementById('addTrangThai').value
    };

    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.getToken() },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi thêm admin');
        
        alert("Thêm thành công!");
        bootstrap.Modal.getInstance(document.getElementById('modalAdd')).hide();
        document.getElementById('formAddAdmin').reset();
        loadAdmins();
    } catch (err) { alert(err.message); }
}

// 3. MỞ MODAL VÀ SỬA ADMIN (PUT)
function openEditModal(data) {
    document.getElementById('editId').value = data.id;
    document.getElementById('editHoTen').value = data.ho_ten;
    document.getElementById('editEmail').value = data.email;
    document.getElementById('editVaiTro').value = data.vai_tro;
    document.getElementById('editTrangThai').value = data.trang_thai;
    document.getElementById('editMatKhau').value = ''; // Xóa trắng ô MK
    new bootstrap.Modal(document.getElementById('modalEdit')).show();
}

async function submitEditAdmin() {
    const id = document.getElementById('editId').value;
    const payload = {
        ho_ten: document.getElementById('editHoTen').value,
        email: document.getElementById('editEmail').value,
        vai_tro: document.getElementById('editVaiTro').value,
        trang_thai: document.getElementById('editTrangThai').value
    };
    
    // Chỉ gửi mật khẩu nếu người dùng có nhập
    const matKhau = document.getElementById('editMatKhau').value;
    if (matKhau) payload.mat_khau = matKhau;

    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.getToken() },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi sửa admin');
        
        alert("Cập nhật thành công!");
        bootstrap.Modal.getInstance(document.getElementById('modalEdit')).hide();
        loadAdmins();
    } catch (err) { alert(err.message); }
}

// 4. XÓA ADMIN (DELETE)
async function deleteAdmin(id) {
    if (!confirm('Bạn chắc chắn muốn xóa vĩnh viễn quản trị viên này?')) return;
    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + Api.getToken() }
        });
        if (!res.ok) throw new Error('Lỗi xóa');
        loadAdmins();
    } catch (err) { alert(err.message); }
}

// 5. KHÓA / MỞ KHÓA ADMIN (PATCH)
async function toggleStatus(id, newStatus) {
    const actionName = newStatus === 'khoa' ? 'khóa' : 'mở khóa';
    if (!confirm(`Bạn muốn ${actionName} tài khoản này?`)) return;
    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/users/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.getToken() },
            body: JSON.stringify({ trang_thai: newStatus })
        });
        if (!res.ok) throw new Error('Lỗi cập nhật trạng thái');
        loadAdmins();
    } catch (err) { alert(err.message); }
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>