<?php
// ĐÃ SỬA: Xóa bỏ PHP xử lý CRUD bằng PDO.
$pageTitle = 'Quản lý Sản phẩm / Dịch vụ';
$activeMenu = 'products';
require_once __DIR__ . '/header.php';
?>

<div class="row g-3 mb-4">
    <div class="col-sm-6">
        <div class="stat-card" style="background:linear-gradient(135deg,#1d4ed8,#3b82f6)">
            <i class="fa-solid fa-box-open stat-icon"></i>
            <!-- ĐÃ SỬA: Bổ sung ID để JS đổ số liệu -->
            <div class="stat-value" id="valTotal">...</div>
            <div class="stat-label">Tổng sản phẩm & gói dịch vụ</div>
        </div>
    </div>
    <div class="col-sm-6">
        <div class="stat-card" style="background:linear-gradient(135deg,#059669,#34d399)">
            <i class="fa-solid fa-check-circle stat-icon"></i>
            <div class="stat-value" id="valActive">...</div>
            <div class="stat-label">Đang mở bán</div>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="fa-solid fa-list me-2 text-primary"></i>Danh sách Sản phẩm</span>
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalAdd">
            <i class="fa-solid fa-plus"></i> Thêm Sản phẩm
        </button>
    </div>

    <div class="card-body border-bottom pb-3">
        <!-- ĐÃ SỬA: Xử lý Submit form bằng Javascript -->
        <form id="filterForm" onsubmit="event.preventDefault(); loadProducts();" class="row g-2">
            <div class="col-sm-6">
                <input type="text" id="searchQ" class="form-control form-control-sm" placeholder="Tìm tên hoặc mã SP...">
            </div>
            <div class="col-sm-4">
                <select id="filterLoai" class="form-select form-select-sm">
                    <option value="">-- Tất cả phân loại --</option>
                    <option value="dich_vu_so">Dịch vụ số</option>
                    <option value="combo">Combo / Gói bảng giá</option>
                </select>
            </div>
            <div class="col-sm-2 d-flex gap-1">
                <button type="submit" class="btn btn-primary btn-sm flex-fill"><i class="fa-solid fa-filter"></i> Lọc</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="resetFilters()"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </form>
    </div>

    <div class="table-responsive">
        <table class="table table-hover mb-0">
            <thead>
                <tr>
                    <th>Mã SP</th>
                    <th>Tên sản phẩm</th>
                    <th>Loại</th>
                    <th>Giá niêm yết</th>
                    <th>Trạng thái</th>
                    <th style="width:120px">Thao tác</th>
                </tr>
            </thead>
            <!-- ĐÃ SỬA: Khung rỗng chờ Javascript đổ dữ liệu -->
            <tbody id="productTableBody">
                <tr><td colspan="6" class="text-center py-4">Đang tải dữ liệu...</td></tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Modal Form (Dùng chung cho Thêm và Sửa bằng JS) -->
<div class="modal fade" id="modalAdd" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- ĐÃ SỬA: Gắn sự kiện JS để phân biệt Thêm/Sửa -->
            <form id="formProduct" onsubmit="event.preventDefault(); submitProduct();">
                <input type="hidden" id="formAction" value="add">
                <input type="hidden" id="formId" value="">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Thêm Sản phẩm</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <label class="form-label small fw-bold">Mã SP *</label>
                            <input type="text" id="inpMa" class="form-control" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label small fw-bold">Phân loại *</label>
                            <select id="inpLoai" class="form-select">
                                <option value="dich_vu_so">Dịch vụ số</option>
                                <option value="combo">Combo Gói cước</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Tên sản phẩm *</label>
                        <input type="text" id="inpTen" class="form-control" required>
                    </div>
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <label class="form-label small fw-bold">Giá niêm yết (VNĐ)</label>
                            <input type="number" id="inpGia" class="form-control" value="0">
                        </div>
                        <div class="col-6">
                            <label class="form-label small fw-bold">Đơn vị tính</label>
                            <input type="text" id="inpDonVi" class="form-control" value="tháng">
                        </div>
                    </div>
                    <div class="row g-2">
                        <div class="col-6">
                            <label class="form-label small fw-bold">Danh mục DB</label>
                            <select id="inpDanhMuc" class="form-select">
                                <option value="1">1 - Dịch vụ số</option>
                                <option value="2">2 - Bảng giá Combo</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label small fw-bold">Trạng thái</label>
                            <select id="inpTrangThai" class="form-select">
                                <option value="dang_ban">Đang bán</option>
                                <option value="sap_ra_mat">Sắp ra mắt</option>
                                <option value="ngung_ban">Ngừng bán</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary w-100">Lưu thông tin</button>
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
    loadProducts();
});

function resetFilters() {
    document.getElementById('filterForm').reset();
    loadProducts();
}

// Chuyển thể hàm createSlug từ PHP sang Javascript
function createSlug(str) {
    return str.toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳýỵỷỹ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\-]+/g, '-') // Đổi các ký tự không hợp lệ thành dấu gạch ngang
        .replace(/^-+|-+$/g, '');     // Xóa gạch ngang ở đầu và cuối chuỗi
}

// 1. LẤY DANH SÁCH & THỐNG KÊ (GET)
async function loadProducts() {
    const q = document.getElementById('searchQ').value;
    const loai = document.getElementById('filterLoai').value;
    const query = new URLSearchParams({ q, loai }).toString();
    
    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/products?${query}`, {
            headers: { 'Authorization': 'Bearer ' + Api.getToken() }
        });
        const data = await res.json();
        
        // Thống kê
        document.getElementById('valTotal').innerText = data.stats?.total || 0;
        document.getElementById('valActive').innerText = data.stats?.active || 0;

        // Vẽ bảng
        const tbody = document.getElementById('productTableBody');
        if (!data.products || data.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Không tìm thấy sản phẩm nào.</td></tr>';
            return;
        }

        let html = '';
        data.products.forEach(p => {
            // Định dạng giá tiền
            const formatGia = Number(p.gia_niem_yet).toLocaleString('vi-VN');
            
            // Định dạng badge Loại và Trạng thái
            const typeBadge = p.loai_san_pham === 'combo' 
                ? '<span class="badge bg-purple" style="background:#8800CC">Gói Combo</span>' 
                : '<span class="badge bg-info text-dark">Dịch vụ số</span>';
                
            let statusBadge = '<span class="badge bg-warning text-dark">Sắp ra mắt</span>';
            if(p.trang_thai === 'dang_ban') statusBadge = '<span class="badge bg-success">Đang bán</span>';
            if(p.trang_thai === 'ngung_ban') statusBadge = '<span class="badge bg-danger">Ngừng bán</span>';

            const safeObj = JSON.stringify(p).replace(/"/g, '&quot;');

            html += `<tr>
                <td class="fw-bold text-primary">${p.ma_san_pham}</td>
                <td>${p.ten_san_pham}</td>
                <td>${typeBadge}</td>
                <td class="text-danger fw-semibold">${formatGia} ₫ / ${p.don_vi_tinh}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-outline-primary btn-action btn-sm me-1" onclick="openEdit(${safeObj})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-outline-danger btn-action btn-sm" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
        
    } catch (err) {
        document.getElementById('productTableBody').innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu.</td></tr>';
    }
}

// 2. XỬ LÝ SUBMIT (Tự động nhận biết THÊM hay SỬA)
async function submitProduct() {
    const action = document.getElementById('formAction').value; // 'add' hoặc 'edit'
    const id = document.getElementById('formId').value;
    const tenSP = document.getElementById('inpTen').value;

    const payload = {
        ma_san_pham: document.getElementById('inpMa').value,
        ten_san_pham: tenSP,
        slug: createSlug(tenSP), // Tự động tạo slug bằng JS
        loai_san_pham: document.getElementById('inpLoai').value,
        danh_muc_id: document.getElementById('inpDanhMuc').value,
        gia_niem_yet: document.getElementById('inpGia').value,
        don_vi_tinh: document.getElementById('inpDonVi').value,
        trang_thai: document.getElementById('inpTrangThai').value
    };

    try {
        let res;
        if (action === 'add') {
            // Gửi API tạo mới (POST)
            res = await fetch(`${GLOBAL_API_URL}/api/admin/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.getToken() },
                body: JSON.stringify(payload)
            });
        } else {
            // Gửi API cập nhật (PUT)
            res = await fetch(`${GLOBAL_API_URL}/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.getToken() },
                body: JSON.stringify(payload)
            });
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi xử lý sản phẩm');
        
        alert(action === 'add' ? "Thêm thành công!" : "Cập nhật thành công!");
        bootstrap.Modal.getInstance(document.getElementById('modalAdd')).hide();
        loadProducts();
    } catch (err) { alert(err.message); }
}

// 3. MỞ MODAL SỬA
function openEdit(p) {
    document.getElementById('formAction').value = 'edit';
    document.getElementById('modalTitle').innerText = 'Sửa Sản phẩm';
    document.getElementById('formId').value = p.id;
    document.getElementById('inpMa').value = p.ma_san_pham;
    document.getElementById('inpTen').value = p.ten_san_pham;
    document.getElementById('inpLoai').value = p.loai_san_pham;
    document.getElementById('inpGia').value = p.gia_niem_yet;
    document.getElementById('inpDonVi').value = p.don_vi_tinh;
    document.getElementById('inpDanhMuc').value = p.danh_muc_id;
    document.getElementById('inpTrangThai').value = p.trang_thai;
    new bootstrap.Modal(document.getElementById('modalAdd')).show();
}

// Reset form khi modal đóng lại
document.getElementById('modalAdd').addEventListener('hidden.bs.modal', function () {
    document.getElementById('formProduct').reset();
    document.getElementById('formAction').value = 'add';
    document.getElementById('formId').value = '';
    document.getElementById('modalTitle').innerText = 'Thêm Sản phẩm';
});

// 4. XÓA SẢN PHẨM (DELETE)
async function deleteProduct(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
    try {
        const res = await fetch(`${GLOBAL_API_URL}/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + Api.getToken() }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Không thể xóa vì sản phẩm đang nằm trong giỏ hàng/đơn hàng.');
        loadProducts();
    } catch (err) { alert(err.message); }
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>