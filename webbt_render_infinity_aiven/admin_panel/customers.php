<?php
/**
 * customers.php — Quản lý Khách hàng
 * CRUD: Thêm / Sửa / Xóa / Khóa-Mở khóa
 * Trường: Họ tên, Email, SĐT, Địa chỉ, Trạng thái, Ngày tạo
 */

require_once __DIR__ . '/db.php';

// ── Xử lý Form (POST) ────────────────────────────────────
$msg = '';
$msgType = 'success';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // ── THÊM khách hàng ───────────────────────────────────
    if ($action === 'add') {
        $hoTen    = trim($_POST['ho_ten']         ?? '');
        $email    = trim($_POST['email']          ?? '');
        $sdt      = trim($_POST['so_dien_thoai']  ?? '');
        $diaChi   = trim($_POST['dia_chi']        ?? '');
        $trangThai= $_POST['trang_thai']          ?? 'hoat_dong';

        if (!$hoTen || !$email) {
            $msg = 'Vui lòng điền đầy đủ Họ tên và Email.';
            $msgType = 'danger';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $msg = 'Địa chỉ email không hợp lệ.';
            $msgType = 'danger';
        } else {
            try {
                $stmt = $pdo->prepare(
                    'INSERT INTO customers (ho_ten, email, so_dien_thoai, dia_chi, trang_thai)
                     VALUES (:ho_ten, :email, :sdt, :dia_chi, :trang_thai)'
                );
                $stmt->execute([
                    ':ho_ten'     => $hoTen,
                    ':email'      => $email,
                    ':sdt'        => $sdt ?: null,
                    ':dia_chi'    => $diaChi ?: null,
                    ':trang_thai' => $trangThai,
                ]);
                $msg = "✅ Đã thêm khách hàng <strong>" . htmlspecialchars($hoTen) . "</strong> thành công!";
            } catch (PDOException $e) {
                $msg = 'Lỗi: ' . (str_contains($e->getMessage(), 'Duplicate') ? 'Email đã tồn tại trong hệ thống.' : $e->getMessage());
                $msgType = 'danger';
            }
        }
    }

    // ── SỬA khách hàng ────────────────────────────────────
    elseif ($action === 'edit') {
        $id       = (int)($_POST['id']            ?? 0);
        $hoTen    = trim($_POST['ho_ten']         ?? '');
        $email    = trim($_POST['email']          ?? '');
        $sdt      = trim($_POST['so_dien_thoai']  ?? '');
        $diaChi   = trim($_POST['dia_chi']        ?? '');
        $trangThai= $_POST['trang_thai']          ?? 'hoat_dong';

        if (!$id || !$hoTen || !$email) {
            $msg = 'Dữ liệu không hợp lệ.';
            $msgType = 'danger';
        } else {
            try {
                $stmt = $pdo->prepare(
                    'UPDATE customers
                     SET ho_ten=:ho_ten, email=:email, so_dien_thoai=:sdt,
                         dia_chi=:dia_chi, trang_thai=:trang_thai
                     WHERE id=:id'
                );
                $stmt->execute([
                    ':ho_ten'     => $hoTen,
                    ':email'      => $email,
                    ':sdt'        => $sdt ?: null,
                    ':dia_chi'    => $diaChi ?: null,
                    ':trang_thai' => $trangThai,
                    ':id'         => $id,
                ]);
                $msg = "✅ Đã cập nhật thông tin khách hàng <strong>" . htmlspecialchars($hoTen) . "</strong>!";
            } catch (PDOException $e) {
                $msg = 'Lỗi: ' . $e->getMessage();
                $msgType = 'danger';
            }
        }
    }

    // ── XÓA khách hàng ────────────────────────────────────
    elseif ($action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            try {
                $stmt = $pdo->prepare('DELETE FROM customers WHERE id = :id');
                $stmt->execute([':id' => $id]);
                $msg = '🗑️ Đã xóa khách hàng thành công.';
            } catch (PDOException $e) {
                $msg = 'Lỗi khi xóa: ' . $e->getMessage();
                $msgType = 'danger';
            }
        }
    }

    // ── KHÓA / MỞ KHÓA ───────────────────────────────────
    elseif ($action === 'toggle_status') {
        $id        = (int)($_POST['id']         ?? 0);
        $newStatus = $_POST['new_status']        ?? 'hoat_dong';
        if ($id > 0) {
            try {
                $stmt = $pdo->prepare('UPDATE customers SET trang_thai = :ts WHERE id = :id');
                $stmt->execute([':ts' => $newStatus, ':id' => $id]);
                $label = $newStatus === 'khoa' ? 'Khóa' : 'Mở khóa';
                $msg = "🔒 Đã <strong>$label</strong> tài khoản khách hàng thành công.";
            } catch (PDOException $e) {
                $msg = 'Lỗi: ' . $e->getMessage();
                $msgType = 'danger';
            }
        }
    }
}

// ── Lấy danh sách khách hàng ─────────────────────────────
$search       = trim($_GET['q']          ?? '');
$filterStatus = $_GET['trang_thai']      ?? '';

$sql    = 'SELECT * FROM customers WHERE 1=1';
$params = [];

if ($search !== '') {
    $sql .= ' AND (ho_ten LIKE :q OR email LIKE :q OR so_dien_thoai LIKE :q)';
    $params[':q'] = "%$search%";
}
if ($filterStatus !== '') {
    $sql .= ' AND trang_thai = :ts';
    $params[':ts'] = $filterStatus;
}
$sql .= ' ORDER BY id DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$customers = $stmt->fetchAll();

// Thống kê
$total       = $pdo->query('SELECT COUNT(*) FROM customers')->fetchColumn();
$totalActive = $pdo->query("SELECT COUNT(*) FROM customers WHERE trang_thai='hoat_dong'")->fetchColumn();
$totalLocked = $pdo->query("SELECT COUNT(*) FROM customers WHERE trang_thai='khoa'")->fetchColumn();
$thisMonth   = $pdo->query("SELECT COUNT(*) FROM customers WHERE MONTH(created_at)=MONTH(NOW()) AND YEAR(created_at)=YEAR(NOW())")->fetchColumn();

// ── Layout ────────────────────────────────────────────────
$pageTitle  = 'Quản lý Khách hàng';
$activeMenu = 'customers';
require_once __DIR__ . '/header.php';
?>

<!-- ── Thống kê nhanh ─────────────────────────────────── -->
<div class="row g-3 mb-4">
    <div class="col-sm-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">
            <i class="fa-solid fa-users stat-icon"></i>
            <div class="stat-value"><?= $total ?></div>
            <div class="stat-label">Tổng khách hàng</div>
        </div>
    </div>
    <div class="col-sm-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#059669,#34d399)">
            <i class="fa-solid fa-circle-check stat-icon"></i>
            <div class="stat-value"><?= $totalActive ?></div>
            <div class="stat-label">Đang hoạt động</div>
        </div>
    </div>
    <div class="col-sm-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#dc2626,#f87171)">
            <i class="fa-solid fa-lock stat-icon"></i>
            <div class="stat-value"><?= $totalLocked ?></div>
            <div class="stat-label">Đã khóa</div>
        </div>
    </div>
    <div class="col-sm-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#d97706,#fbbf24)">
            <i class="fa-solid fa-user-plus stat-icon"></i>
            <div class="stat-value"><?= $thisMonth ?></div>
            <div class="stat-label">Mới tháng này</div>
        </div>
    </div>
</div>

<!-- ── Alert thông báo ───────────────────────────────────── -->
<?php if ($msg): ?>
<div class="alert alert-<?= $msgType ?> alert-dismissible fade show" role="alert">
    <?= $msg ?>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php endif; ?>

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
        <form method="GET" class="row g-2 align-items-end">
            <div class="col-sm-7">
                <label class="form-label small fw-semibold mb-1">Tìm kiếm</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text"><i class="fa-solid fa-search"></i></span>
                    <input type="text" name="q" class="form-control"
                           placeholder="Họ tên, email hoặc số điện thoại..."
                           value="<?= htmlspecialchars($search) ?>">
                </div>
            </div>
            <div class="col-sm-3">
                <label class="form-label small fw-semibold mb-1">Trạng thái</label>
                <select name="trang_thai" class="form-select form-select-sm">
                    <option value="">-- Tất cả --</option>
                    <option value="hoat_dong" <?= $filterStatus==='hoat_dong'?'selected':'' ?>>Hoạt động</option>
                    <option value="khoa"      <?= $filterStatus==='khoa'?'selected':'' ?>>Đã khóa</option>
                </select>
            </div>
            <div class="col-sm-2 d-flex gap-1">
                <button type="submit" class="btn btn-primary btn-sm flex-fill">
                    <i class="fa-solid fa-filter me-1"></i>Lọc
                </button>
                <a href="customers.php" class="btn btn-outline-secondary btn-sm" title="Xóa bộ lọc">
                    <i class="fa-solid fa-xmark"></i>
                </a>
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
                <tbody>
                <?php if (empty($customers)): ?>
                    <tr>
                        <td colspan="8" class="text-center py-4 text-muted">
                            <i class="fa-solid fa-inbox fa-2x mb-2 d-block"></i>
                            Không tìm thấy khách hàng nào.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($customers as $i => $c): ?>
                    <tr>
                        <td class="text-muted"><?= $i + 1 ?></td>
                        <td>
                            <div class="d-flex align-items-center gap-2">
                                <div style="width:32px;height:32px;border-radius:50%;background:#ede9fe;
                                            display:flex;align-items:center;justify-content:center;
                                            font-weight:700;color:#7c3aed;font-size:13px;flex-shrink:0">
                                    <?= mb_strtoupper(mb_substr($c['ho_ten'], 0, 1)) ?>
                                </div>
                                <span class="fw-medium"><?= htmlspecialchars($c['ho_ten']) ?></span>
                            </div>
                        </td>
                        <td><?= htmlspecialchars($c['email']) ?></td>
                        <td>
                            <?php if ($c['so_dien_thoai']): ?>
                                <a href="tel:<?= htmlspecialchars($c['so_dien_thoai']) ?>"
                                   class="text-decoration-none">
                                    <?= htmlspecialchars($c['so_dien_thoai']) ?>
                                </a>
                            <?php else: ?>
                                <span class="text-muted">—</span>
                            <?php endif; ?>
                        </td>
                        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                            title="<?= htmlspecialchars($c['dia_chi'] ?? '') ?>">
                            <?= $c['dia_chi'] ? htmlspecialchars($c['dia_chi']) : '<span class="text-muted">—</span>' ?>
                        </td>
                        <td>
                            <?php if ($c['trang_thai'] === 'hoat_dong'): ?>
                                <span class="badge badge-hoat-dong">
                                    <i class="fa-solid fa-circle-check me-1"></i>Hoạt động
                                </span>
                            <?php else: ?>
                                <span class="badge badge-khoa">
                                    <i class="fa-solid fa-lock me-1"></i>Đã khóa
                                </span>
                            <?php endif; ?>
                        </td>
                        <td class="text-muted" style="font-size:13px">
                            <?= date('d/m/Y', strtotime($c['created_at'])) ?>
                        </td>
                        <td>
                            <!-- Nút Sửa -->
                            <button class="btn btn-outline-primary btn-action me-1"
                                    onclick="openEditModal(<?= htmlspecialchars(json_encode($c)) ?>)"
                                    title="Sửa">
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            <!-- Nút Khóa / Mở khóa -->
                            <form method="POST" class="d-inline"
                                  onsubmit="return confirm('<?= $c['trang_thai']==='hoat_dong' ? 'Khóa' : 'Mở khóa' ?> tài khoản này?')">
                                <input type="hidden" name="action" value="toggle_status">
                                <input type="hidden" name="id" value="<?= $c['id'] ?>">
                                <input type="hidden" name="new_status"
                                       value="<?= $c['trang_thai']==='hoat_dong' ? 'khoa' : 'hoat_dong' ?>">
                                <button type="submit"
                                        class="btn btn-action <?= $c['trang_thai']==='hoat_dong' ? 'btn-outline-warning' : 'btn-outline-success' ?>"
                                        title="<?= $c['trang_thai']==='hoat_dong' ? 'Khóa' : 'Mở khóa' ?>">
                                    <i class="fa-solid <?= $c['trang_thai']==='hoat_dong' ? 'fa-lock' : 'fa-lock-open' ?>"></i>
                                </button>
                            </form>

                            <!-- Nút Xóa -->
                            <form method="POST" class="d-inline"
                                  onsubmit="return confirm('Xóa vĩnh viễn khách hàng này?')">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?= $c['id'] ?>">
                                <button type="submit" class="btn btn-outline-danger btn-action" title="Xóa">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card-footer text-muted" style="font-size:13px">
        Hiển thị <strong><?= count($customers) ?></strong> / <strong><?= $total ?></strong> khách hàng
    </div>
</div>

<!-- ══════════════════════════════════════════════════════ -->
<!-- Modal THÊM Khách hàng                                  -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="modal fade" id="modalAdd" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <form method="POST">
                <input type="hidden" name="action" value="add">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa-solid fa-user-plus text-primary me-2"></i>Thêm Khách hàng
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Họ và tên <span class="text-danger">*</span></label>
                        <input type="text" name="ho_ten" class="form-control"
                               placeholder="Nguyễn Thị A" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                        <input type="email" name="email" class="form-control"
                               placeholder="khachhang@gmail.com" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Số điện thoại</label>
                        <input type="tel" name="so_dien_thoai" class="form-control"
                               placeholder="0901234567"
                               pattern="[0-9]{9,11}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Địa chỉ</label>
                        <textarea name="dia_chi" class="form-control" rows="2"
                                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành..."></textarea>
                    </div>
                    <div>
                        <label class="form-label fw-semibold">Trạng thái</label>
                        <select name="trang_thai" class="form-select">
                            <option value="hoat_dong">Hoạt động</option>
                            <option value="khoa">Khóa</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fa-solid fa-plus me-1"></i>Thêm Khách hàng
                    </button>
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
            <form method="POST">
                <input type="hidden" name="action" value="edit">
                <input type="hidden" name="id" id="editId">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa-solid fa-pen text-warning me-2"></i>Sửa Khách hàng
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Họ và tên <span class="text-danger">*</span></label>
                        <input type="text" name="ho_ten" id="editHoTen" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                        <input type="email" name="email" id="editEmail" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Số điện thoại</label>
                        <input type="tel" name="so_dien_thoai" id="editSdt" class="form-control"
                               pattern="[0-9]{9,11}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Địa chỉ</label>
                        <textarea name="dia_chi" id="editDiaChi" class="form-control" rows="2"></textarea>
                    </div>
                    <div>
                        <label class="form-label fw-semibold">Trạng thái</label>
                        <select name="trang_thai" id="editTrangThai" class="form-select">
                            <option value="hoat_dong">Hoạt động</option>
                            <option value="khoa">Khóa</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button type="submit" class="btn btn-warning text-white">
                        <i class="fa-solid fa-floppy-disk me-1"></i>Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- ── JS: Mở modal Sửa với dữ liệu ─────────────────────── -->
<script>
function openEditModal(data) {
    document.getElementById('editId').value        = data.id;
    document.getElementById('editHoTen').value     = data.ho_ten;
    document.getElementById('editEmail').value     = data.email;
    document.getElementById('editSdt').value       = data.so_dien_thoai || '';
    document.getElementById('editDiaChi').value    = data.dia_chi || '';
    document.getElementById('editTrangThai').value = data.trang_thai;
    new bootstrap.Modal(document.getElementById('modalEdit')).show();
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
