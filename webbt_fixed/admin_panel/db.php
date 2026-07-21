<?php
/**
 * db.php — Kết nối PDO đến database vnpt_admin
 * Dùng chung cho toàn bộ Admin Panel.
 *
 * Cách dùng trong các file khác:
 *   require_once __DIR__ . '/db.php';
 *   // Biến $pdo đã sẵn sàng
 */

// ── Cấu hình kết nối ──────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'vnpt_admin');
define('DB_USER', 'root');
define('DB_PASS', '');          // Đổi thành mật khẩu MySQL của bạn
define('DB_CHARSET', 'utf8mb4');

// ── Tạo kết nối PDO ───────────────────────────────────────
$dsn = sprintf(
    'mysql:host=%s;port=%s;dbname=%s;charset=%s',
    DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
);

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,   // Ném exception khi lỗi
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,         // Trả về mảng kết hợp
    PDO::ATTR_EMULATE_PREPARES   => false,                    // Dùng prepared statement thật
];

try {
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // Hiển thị lỗi thân thiện (không lộ thông tin nhạy cảm)
    http_response_code(500);
    die('<div style="font-family:sans-serif;padding:2rem;color:#dc3545;">
        <h3>⚠️ Không thể kết nối cơ sở dữ liệu</h3>
        <p>Vui lòng kiểm tra:</p>
        <ul>
            <li>MySQL đang chạy (XAMPP/Laragon)</li>
            <li>Database <strong>vnpt_admin</strong> đã được tạo (chạy <code>database.sql</code>)</li>
            <li>Thông tin kết nối trong <code>db.php</code> (DB_USER, DB_PASS)</li>
        </ul>
        <details><summary>Chi tiết lỗi (debug)</summary><pre>' . htmlspecialchars($e->getMessage()) . '</pre></details>
    </div>');
}
