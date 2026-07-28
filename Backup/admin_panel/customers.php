<?php
// ĐÃ SỬA: Xóa toàn bộ PHP xử lý CRUD bằng PDO. Chỉ giữ lại phần gọi layout.
$pageTitle  = 'Quản lý Khách hàng';
$activeMenu = 'customers';
require_once __DIR__ . '/header.php';
?>

<!-- ── Thống kê nhanh ─────────────────────────────────── -->
<div class="row g-3 mb-4">
    <div class="col-sm-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">
            <i class="fa-solid fa-users stat-icon"></i>
            <!-- ĐÃ SỬA: Thêm id để Javascript đổ số liệu vào đây -->
            <div class="stat-value" id="valTotal">...</div>
            <div class="stat-label">Tổng khách hàng</div>
        </div>
    </div>
    <div class="col-sm-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#059669,#34d399)">
            <i class="fa-solid fa-circle-check stat-icon"></i>
            <div class="stat-value" id="valActive">...</div>
            <div class="stat-label">Đang hoạt động</div>
        </div>
    </div>
    <div class="col-sm-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#dc2626,#f87171)">
            <i class="fa-solid fa-lock stat-icon"></i>
            <div class="stat-value" id="valLocked">...</div>
            <div class="stat-label">Đã khóa</div>
        </div>
    </div>
    <div class="col-sm-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#d97706,#fbbf24)">
            <i class="fa-solid fa-user-plus stat-icon"></i>
            <div class="stat-value" id="valNew">...</div>
            <div class="stat-label">Mới tháng này</div>
        </div>
    </div>
</div>

<!-- ── Card danh sách ────────────────────────────────────── -->
<div class="card">
    <div class="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <span><i class="fa-solid fa-users me-2 text-primary"></i>Danh sách Khách hàng</span>
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalAdd">
            <i class="fa-solid fa-plus me-1"></i> Thêm Khách hàng
        </button>
    </div>

    <!-- Bộ lọc / Tìm kiếm -->
    <div class="card-body border-bottom pb-3">
        <!-- ĐÃ SỬA: Chuyển form thành xử lý bằng Javascript -->
        <form id="filterForm" onsubmit="event.preventDefault(); loadCustomers();" class="row g-2 align-items-end">
            <div class="col-sm-7">
                <label class="form-label small fw-semibold mb-1">Tìm kiếm</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text"><i class="fa-solid fa-search"></i></span>
                    <input type="text" id="searchQ" class="form-control" placeholder="Họ tên, email hoặc số điện thoại...">
                </div>
            </div>
            <div class="col-sm-3">
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
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th style="width:140px">Thao tác</th>
                    </tr>
                </thead>
                <!-- ĐÃ SỬA: tbody rỗng để Javascript đổ dữ liệu -->
                <tbody id="customerTableBody">
                    <tr><td colspan="8" class="text-center py-4">Đang tải dữ liệu...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- ══════════════════════════════════════════════════════ -->
<!-- Modal THÊM Khách hàng                                  -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="modal fade" id="modalAdd" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <!-- ĐÃ SỬA: onSubmit JS -->
            <form id="formAddCustomer" onsubmit="event.preventDefault(); submitAddCustomer();">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa-solid fa-user-plus text-primary me-2"></i>Thêm Khách hàng
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
                        <label class="form-label fw-semibold">Số điện thoại</label>
                        <input type="tel" id="addSdt" class="form-control" pattern="[0-9]{9,11}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Địa chỉ</label>
                        <textarea id="addDiaChi" class="form-control" rows="2"></textarea>
                    </div>
                    <div>
                        <label class="form-label fw-semibold">Trạng thái</label>
                        <select id="addTrangThai" class="form-select">
                            <option value="hoat_dong">Hoạt động</option>
                            <option value="khoa">Khóa</option>
                        </select>
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
<!-- Modal SỬA Khách hàng                                   -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="modal fade" id="modalEdit" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <!-- ĐÃ SỬA: onSubmit JS -->
            <form id="formEditCustomer" onsubmit="event.preventDefault(); submitEditCustomer();">
                <input type="hidden" id="editId">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa-solid fa-pen text-warning me-2"></i>Sửa Khách hàng
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
                        <label class="form-label fw-semibold">Số điện thoại</label>
                        <input type="tel" id="editSdt" class="form-control" pattern="[0-9]{9,11}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Địa chỉ</label>
                        <textarea id="editDiaChi" class="form-control" rows="2"></textarea>
                    </div>
                    <div>
                        <label class="form-label fw-semibold">Trạng thái</label>
                        <select id="editTrangThai" class="form-select">
                            <option value="hoat_dong">Hoạt động</option>
                            <option value="khoa">Khóa</option>
                        </select>
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

document.addEventListener('DOMContentLoaded', () => {
    if (!Api || !Api.getToken()) {
        alert("Vui lòng đăng nhập!");
        window.location.href = '../frontend/index.php';
        return;
    }
    loadCustomers();
});

function resetFilters() {
    document.getElementById('filterForm').reset();
    loadCustomers();
}

// 1. LẤY DANH SÁCH & THỐNG KÊ (GET)
async function loadCustomers() {
    const q = document.getElementById('searchQ').value;
    const status = document.getElementById('filterStatus').value;
    const query = new URLSearchParams({ q, status }).toString();
    
    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/customers?${query}`, {
            headers: { 'Authorization': 'Bearer ' + Api.getToken() }
        });
        const data = await res.json();
        
        // Cập nhật số liệu thống kê
        document.getElementById('valTotal').innerText = data.stats?.total || 0;
        document.getElementById('valActive').innerText = data.stats?.active || 0;
        document.getElementById('valLocked').innerText = data.stats?.locked || 0;
        document.getElementById('valNew').innerText = data.stats?.newThisMonth || 0;

        // Vẽ bảng HTML
        const tbody = document.getElementById('customerTableBody');
        if (!data.customers || data.customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Không tìm thấy khách hàng nào.</td></tr>';
            return;
        }

        let html = '';
        data.customers.forEach((c, i) => {
            const letter = c.ho_ten ? c.ho_ten.charAt(0).toUpperCase() : 'C';
            
            const sdtHtml = c.so_dien_thoai 
                ? `<a href="tel:${c.so_dien_thoai}" class="text-decoration-none">${c.so_dien_thoai}</a>` 
                : `<span class="text-muted">—</span>`;
                
            const diaChiHtml = c.dia_chi || '<span class="text-muted">—</span>';
            
            const statusHtml = c.trang_thai === 'hoat_dong' 
                ? `<span class="badge badge-hoat-dong"><i class="fa-solid fa-circle-check me-1"></i>Hoạt động</span>`
                : `<span class="badge badge-khoa"><i class="fa-solid fa-lock me-1"></i>Đã khóa</span>`;
                
            const dateStr = new Date(c.created_at).toLocaleDateString('vi-VN');
            const safeObj = JSON.stringify(c).replace(/"/g, '&quot;');

            html += `<tr>
                <td class="text-muted">${i + 1}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div style="width:32px;height:32px;border-radius:50%;background:#ede9fe;display:flex;align-items:center;justify-content:center;font-weight:700;color:#7c3aed;font-size:13px;">${letter}</div>
                        <span class="fw-medium">${c.ho_ten}</span>
                    </div>
                </td>
                <td>${c.email}</td>
                <td>${sdtHtml}</td>
                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${c.dia_chi || ''}">${diaChiHtml}</td>
                <td>${statusHtml}</td>
                <td class="text-muted" style="font-size:13px">${dateStr}</td>
                <td>
                    <button class="btn btn-outline-primary btn-action me-1" onclick="openEditModal(${safeObj})" title="Sửa"><i class="fa-solid fa-pen"></i></button>
                    
                    <button class="btn btn-action ${c.trang_thai === 'hoat_dong' ? 'btn-outline-warning' : 'btn-outline-success'}" 
                        onclick="toggleStatus(${c.id}, '${c.trang_thai === 'hoat_dong' ? 'khoa' : 'hoat_dong'}')" title="Khóa/Mở Khóa">
                        <i class="fa-solid ${c.trang_thai === 'hoat_dong' ? 'fa-lock' : 'fa-lock-open'}"></i>
                    </button>
                    
                    <button class="btn btn-outline-danger btn-action" onclick="deleteCustomer(${c.id})" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
        
    } catch (err) {
        document.getElementById('customerTableBody').innerHTML = '<tr><td colspan="8" class="text-center text-danger">Lỗi tải dữ liệu.</td></tr>';
    }
}

// 2. THÊM KHÁCH HÀNG (POST)
async function submitAddCustomer() {
    const payload = {
        ho_ten: document.getElementById('addHoTen').value,
        email: document.getElementById('addEmail').value,
        so_dien_thoai: document.getElementById('addSdt').value,
        dia_chi: document.getElementById('addDiaChi').value,
        trang_thai: document.getElementById('addTrangThai').value
    };

    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.getToken() },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi thêm khách hàng');
        
        alert("Thêm thành công!");
        bootstrap.Modal.getInstance(document.getElementById('modalAdd')).hide();
        document.getElementById('formAddCustomer').reset();
        loadCustomers();
    } catch (err) { alert(err.message); }
}

// 3. MỞ MODAL VÀ SỬA KHÁCH HÀNG (PUT)
function openEditModal(data) {
    document.getElementById('editId').value = data.id;
    document.getElementById('editHoTen').value = data.ho_ten;
    document.getElementById('editEmail').value = data.email;
    document.getElementById('editSdt').value = data.so_dien_thoai || '';
    document.getElementById('editDiaChi').value = data.dia_chi || '';
    document.getElementById('editTrangThai').value = data.trang_thai;
    new bootstrap.Modal(document.getElementById('modalEdit')).show();
}

async function submitEditCustomer() {
    const id = document.getElementById('editId').value;
    const payload = {
        ho_ten: document.getElementById('editHoTen').value,
        email: document.getElementById('editEmail').value,
        so_dien_thoai: document.getElementById('editSdt').value,
        dia_chi: document.getElementById('editDiaChi').value,
        trang_thai: document.getElementById('editTrangThai').value
    };

    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.getToken() },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi sửa khách hàng');
        
        alert("Cập nhật thành công!");
        bootstrap.Modal.getInstance(document.getElementById('modalEdit')).hide();
        loadCustomers();
    } catch (err) { alert(err.message); }
}

// 4. XÓA KHÁCH HÀNG (DELETE)
async function deleteCustomer(id) {
    if (!confirm('Bạn chắc chắn muốn xóa vĩnh viễn khách hàng này?')) return;
    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/customers/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + Api.getToken() }
        });
        if (!res.ok) throw new Error('Lỗi xóa');
        loadCustomers();
    } catch (err) { alert(err.message); }
}

// 5. KHÓA / MỞ KHÓA (PATCH)
async function toggleStatus(id, newStatus) {
    const actionName = newStatus === 'khoa' ? 'khóa' : 'mở khóa';
    if (!confirm(`Bạn muốn ${actionName} tài khoản này?`)) return;
    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/customers/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.getToken() },
            body: JSON.stringify({ trang_thai: newStatus })
        });
        if (!res.ok) throw new Error('Lỗi cập nhật trạng thái');
        loadCustomers();
    } catch (err) { alert(err.message); }
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>