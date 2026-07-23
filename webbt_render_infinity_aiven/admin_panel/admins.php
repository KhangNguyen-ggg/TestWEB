<?php
/**
 * admins.php — Quản lý tài khoản Quản trị viên
 * CRUD: Thêm / Sửa / Xóa / Khóa-Mở khóa
 * Mật khẩu mã hóa bằng password_hash() / password_verify()
 */

require_once __DIR__ . '/db.php';

// ── Xử lý Form (POST) ────────────────────────────────────
$msg = '';
$msgType = 'success';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // ── THÊM admin ────────────────────────────────────────
    if ($action === 'add') {
        $hoTen    = trim($_POST['ho_ten']    ?? '');
        $email    = trim($_POST['email']     ?? '');
        $matKhau  = trim($_POST['mat_khau']  ?? '');
        $vaiTro   = $_POST['vai_tro']        ?? 'admin';
        $trangThai= $_POST['trang_thai']     ?? 'hoat_dong';

        if (!$hoTen || !$email || !$matKhau) {
            $msg = 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu.';
            $msgType = 'danger';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $msg = 'Địa chỉ email không hợp lệ.';
            $msgType = 'danger';
        } elseif (strlen($matKhau) < 6) {
            $msg = 'Mật khẩu phải có ít nhất 6 ký tự.';
            $msgType = 'danger';
        } else {
            try {
                $hash = password_hash($matKhau, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare(
                    'INSERT INTO admins (ho_ten, email, mat_khau, vai_tro, trang_thai)
                     VALUES (:ho_ten, :email, :mat_khau, :vai_tro, :trang_thai)'
                );
                $stmt->execute([
                    ':ho_ten'     => $hoTen,
                    ':email'      => $email,
                    ':mat_khau'   => $hash,
                    ':vai_tro'    => $vaiTro,
                    ':trang_thai' => $trangThai,
                ]);
                $msg = "✅ Đã thêm quản trị viên <strong>" . htmlspecialchars($hoTen) . "</strong> thành công!";
            } catch (PDOException $e) {
                $msg = 'Lỗi: ' . (str_contains($e->getMessage(), 'Duplicate') ? 'Email đã tồn tại trong hệ thống.' : $e->getMessage());
                $msgType = 'danger';
            }
        }
    }

    // ── SỬA admin ─────────────────────────────────────────
    elseif ($action === 'edit') {
        $id       = (int)($_POST['id']         ?? 0);
        $hoTen    = trim($_POST['ho_ten']       ?? '');
        $email    = trim($_POST['email']        ?? '');
        $vaiTro   = $_POST['vai_tro']           ?? 'admin';
        $trangThai= $_POST['trang_thai']        ?? 'hoat_dong';
        $matKhau  = trim($_POST['mat_khau']     ?? '');

        if (!$id || !$hoTen || !$email) {
            $msg = 'Dữ liệu không hợp lệ.';
            $msgType = 'danger';
        } else {
            try {
                if ($matKhau !== '') {
                    // Đổi mật khẩu
                    if (strlen($matKhau) < 6) {
                        throw new Exception('Mật khẩu mới phải có ít nhất 6 ký tự.');
                    }
                    $hash = password_hash($matKhau, PASSWORD_BCRYPT);
                    $stmt = $pdo->prepare(
                        'UPDATE admins SET ho_ten=:ho_ten, email=:email, mat_khau=:mat_khau,
                         vai_tro=:vai_tro, trang_thai=:trang_thai WHERE id=:id'
                    );
                    $stmt->execute([
                        ':ho_ten'     => $hoTen,
                        ':email'      => $email,
                        ':mat_khau'   => $hash,
                        ':vai_tro'    => $vaiTro,
                        ':trang_thai' => $trangThai,
                        ':id'         => $id,
                    ]);
                } else {
                    // Giữ mật khẩu cũ
                    $stmt = $pdo->prepare(
                        'UPDATE admins SET ho_ten=:ho_ten, email=:email,
                         vai_tro=:vai_tro, trang_thai=:trang_thai WHERE id=:id'
                    );
                    $stmt->execute([
                        ':ho_ten'     => $hoTen,
                        ':email'      => $email,
                        ':vai_tro'    => $vaiTro,
                        ':trang_thai' => $trangThai,
                        ':id'         => $id,
                    ]);
                }
                $msg = "✅ Đã cập nhật thông tin quản trị viên <strong>" . htmlspecialchars($hoTen) . "</strong>!";
            } catch (Exception $e) {
                $msg = 'Lỗi: ' . $e->getMessage();
                $msgType = 'danger';
            }
        }
    }

    // ── XÓA admin ─────────────────────────────────────────
    elseif ($action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            try {
                $stmt = $pdo->prepare('DELETE FROM admins WHERE id = :id');
                $stmt->execute([':id' => $id]);
                $msg = '🗑️ Đã xóa quản trị viên thành công.';
            } catch (PDOException $e) {
                $msg = 'Lỗi khi xóa: ' . $e->getMessage();
                $msgType = 'danger';
            }
        }
    }

    // ── KHÓA / MỞ KHÓA ───────────────────────────────────
    elseif ($action === 'toggle_status') {
        $id         = (int)($_POST['id']          ?? 0);
        $newStatus  = $_POST['new_status']         ?? 'hoat_dong';
        if ($id > 0) {
            try {
                $stmt = $pdo->prepare('UPDATE admins SET trang_thai = :ts WHERE id = :id');
                $stmt->execute([':ts' => $newStatus, ':id' => $id]);
                $label = $newStatus === 'khoa' ? 'Khóa' : 'Mở khóa';
                $msg = "🔒 Đã <strong>$label</strong> tài khoản thành công.";
            } catch (PDOException $e) {
                $msg = 'Lỗi: ' . $e->getMessage();
                $msgType = 'danger';
            }
        }
    }
}

// ── Lấy danh sách admins ──────────────────────────────────
$search = trim($_GET['q'] ?? '');
$filterRole   = $_GET['vai_tro']    ?? '';
$filterStatus = $_GET['trang_thai'] ?? '';

$sql    = 'SELECT * FROM admins WHERE 1=1';
$params = [];

if ($search !== '') {
    $sql .= ' AND (ho_ten LIKE :q OR email LIKE :q)';
    $params[':q'] = "%$search%";
}
if ($filterRole !== '') {
    $sql .= ' AND vai_tro = :vt';
    $params[':vt'] = $filterRole;
}
if ($filterStatus !== '') {
    $sql .= ' AND trang_thai = :ts';
    $params[':ts'] = $filterStatus;
}
$sql .= ' ORDER BY id DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$admins = $stmt->fetchAll();

// Đếm tổng
$total      = $pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn();
$totalActive= $pdo->query("SELECT COUNT(*) FROM admins WHERE trang_thai='hoat_dong'")->fetchColumn();
$totalLocked= $pdo->query("SELECT COUNT(*) FROM admins WHERE trang_thai='khoa'")->fetchColumn();

// ── Layout ────────────────────────────────────────────────
$pageTitle  = 'Quản lý Quản trị viên';
$activeMenu = 'admins';
require_once __DIR__ . '/header.php';
?>

<!-- ── Thống kê nhanh ─────────────────────────────────── -->
<div class="row g-3 mb-4">
    <div class="col-sm-4">
        <div class="stat-card" style="background:linear-gradient(135deg,#1d4ed8,#3b82f6)">
            <i class="fa-solid fa-user-shield stat-icon"></i>
            <div class="stat-value"><?= $total ?></div>
            <div class="stat-label">Tổng quản trị viên</div>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="stat-card" style="background:linear-gradient(135deg,#059669,#34d399)">
            <i class="fa-solid fa-circle-check stat-icon"></i>
            <div class="stat-value"><?= $totalActive ?></div>
            <div class="stat-label">Đang hoạt động</div>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="stat-card" style="background:linear-gradient(135deg,#dc2626,#f87171)">
            <i class="fa-solid fa-lock stat-icon"></i>
            <div class="stat-value"><?= $totalLocked ?></div>
            <div class="stat-label">Đã khóa</div>
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
        <span><i class="fa-solid fa-user-shield me-2 text-primary"></i>Danh sách Quản trị viên</span>
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalAdd">
            <i class="fa-solid fa-plus me-1"></i> Thêm Admin
        </button>
    </div>

    <!-- Bộ lọc / Tìm kiếm -->
    <div class="card-body border-bottom pb-3">
        <form method="GET" class="row g-2 align-items-end">
            <div class="col-sm-5">
                <label class="form-label small fw-semibold mb-1">Tìm kiếm</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text"><i class="fa-solid fa-search"></i></span>
                    <input type="text" name="q" class="form-control"
                           placeholder="Họ tên hoặc email..."
                           value="<?= htmlspecialchars($search) ?>">
                </div>
            </div>
            <div class="col-sm-3">
                <label class="form-label small fw-semibold mb-1">Vai trò</label>
                <select name="vai_tro" class="form-select form-select-sm">
                    <option value="">-- Tất cả --</option>
                    <option value="superadmin" <?= $filterRole==='superadmin'?'selected':'' ?>>Super Admin</option>
                    <option value="admin"      <?= $filterRole==='admin'?'selected':'' ?>>Admin</option>
                    <option value="editor"     <?= $filterRole==='editor'?'selected':'' ?>>Editor</option>
                </select>
            </div>
            <div class="col-sm-2">
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
                <a href="admins.php" class="btn btn-outline-secondary btn-sm" title="Xóa bộ lọc">
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
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th style="width:160px">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                <?php if (empty($admins)): ?>
                    <tr>
                        <td colspan="7" class="text-center py-4 text-muted">
                            <i class="fa-solid fa-inbox fa-2x mb-2 d-block"></i>
                            Không tìm thấy quản trị viên nào.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($admins as $i => $a): ?>
                    <tr>
                        <td class="text-muted"><?= $i + 1 ?></td>
                        <td>
                            <div class="d-flex align-items-center gap-2">
                                <div style="width:32px;height:32px;border-radius:50%;background:#dbeafe;
                                            display:flex;align-items:center;justify-content:center;
                                            font-weight:700;color:#1d4ed8;font-size:13px;flex-shrink:0">
                                    <?= mb_strtoupper(mb_substr($a['ho_ten'], 0, 1)) ?>
                                </div>
                                <span class="fw-medium"><?= htmlspecialchars($a['ho_ten']) ?></span>
                            </div>
                        </td>
                        <td><?= htmlspecialchars($a['email']) ?></td>
                        <td>
                            <?php
                            $roleMap = [
                                'superadmin' => ['Super Admin', 'danger'],
                                'admin'      => ['Admin',       'primary'],
                                'editor'     => ['Editor',      'secondary'],
                            ];
                            [$roleLabel, $roleColor] = $roleMap[$a['vai_tro']] ?? [$a['vai_tro'], 'secondary'];
                            ?>
                            <span class="badge bg-<?= $roleColor ?>"><?= $roleLabel ?></span>
                        </td>
                        <td>
                            <?php if ($a['trang_thai'] === 'hoat_dong'): ?>
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
                            <?= date('d/m/Y', strtotime($a['created_at'])) ?>
                        </td>
                        <td>
                            <!-- Nút Sửa -->
                            <button class="btn btn-outline-primary btn-action me-1"
                                    onclick="openEditModal(<?= htmlspecialchars(json_encode($a)) ?>)"
                                    title="Sửa">
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            <!-- Nút Khóa / Mở khóa -->
                            <form method="POST" class="d-inline"
                                  onsubmit="return confirm('<?= $a['trang_thai']==='hoat_dong' ? 'Khóa' : 'Mở khóa' ?> tài khoản này?')">
                                <input type="hidden" name="action" value="toggle_status">
                                <input type="hidden" name="id" value="<?= $a['id'] ?>">
                                <input type="hidden" name="new_status"
                                       value="<?= $a['trang_thai']==='hoat_dong' ? 'khoa' : 'hoat_dong' ?>">
                                <button type="submit"
                                        class="btn btn-action <?= $a['trang_thai']==='hoat_dong' ? 'btn-outline-warning' : 'btn-outline-success' ?>"
                                        title="<?= $a['trang_thai']==='hoat_dong' ? 'Khóa' : 'Mở khóa' ?>">
                                    <i class="fa-solid <?= $a['trang_thai']==='hoat_dong' ? 'fa-lock' : 'fa-lock-open' ?>"></i>
                                </button>
                            </form>

                            <!-- Nút Xóa -->
                            <form method="POST" class="d-inline"
                                  onsubmit="return confirm('Xóa vĩnh viễn quản trị viên này?')">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?= $a['id'] ?>">
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
        Hiển thị <strong><?= count($admins) ?></strong> / <strong><?= $total ?></strong> quản trị viên
    </div>
</div>

<!-- ══════════════════════════════════════════════════════ -->
<!-- Modal THÊM Admin                                       -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="modal fade" id="modalAdd" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <form method="POST">
                <input type="hidden" name="action" value="add">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa-solid fa-user-plus text-primary me-2"></i>Thêm Quản trị viên
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Họ và tên <span class="text-danger">*</span></label>
                        <input type="text" name="ho_ten" class="form-control"
                               placeholder="Nguyễn Văn A" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                        <input type="email" name="email" class="form-control"
                               placeholder="admin@vnvd.vn" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Mật khẩu <span class="text-danger">*</span></label>
                        <input type="password" name="mat_khau" class="form-control"
                               placeholder="Tối thiểu 6 ký tự" required minlength="6">
                        <div class="form-text">Mật khẩu sẽ được mã hóa bằng bcrypt.</div>
                    </div>
                    <div class="row g-3">
                        <div class="col-6">
                            <label class="form-label fw-semibold">Vai trò</label>
                            <select name="vai_tro" class="form-select">
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                                <option value="editor">Editor</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold">Trạng thái</label>
                            <select name="trang_thai" class="form-select">
                                <option value="hoat_dong">Hoạt động</option>
                                <option value="khoa">Khóa</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fa-solid fa-plus me-1"></i>Thêm Admin
                    </button>
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
            <form method="POST">
                <input type="hidden" name="action" value="edit">
                <input type="hidden" name="id" id="editId">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa-solid fa-pen text-warning me-2"></i>Sửa Quản trị viên
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
                        <label class="form-label fw-semibold">Mật khẩu mới</label>
                        <input type="password" name="mat_khau" class="form-control"
                               placeholder="Để trống = giữ nguyên mật khẩu cũ" minlength="6">
                        <div class="form-text">Chỉ điền nếu muốn đổi mật khẩu.</div>
                    </div>
                    <div class="row g-3">
                        <div class="col-6">
                            <label class="form-label fw-semibold">Vai trò</label>
                            <select name="vai_tro" id="editVaiTro" class="form-select">
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                                <option value="editor">Editor</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold">Trạng thái</label>
                            <select name="trang_thai" id="editTrangThai" class="form-select">
                                <option value="hoat_dong">Hoạt động</option>
                                <option value="khoa">Khóa</option>
                            </select>
                        </div>
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
    document.getElementById('editVaiTro').value    = data.vai_tro;
    document.getElementById('editTrangThai').value = data.trang_thai;
    new bootstrap.Modal(document.getElementById('modalEdit')).show();
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
