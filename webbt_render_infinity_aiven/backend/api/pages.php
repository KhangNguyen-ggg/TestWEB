<?php
/**
 * pages.php — API lấy thông tin trang tĩnh theo slug
 * ĐÃ SỬA: SQL injection (dùng prepared statement thay vì string concat)
 */
header('Content-Type: application/json');
require_once __DIR__ . '/../db/database.php';

$slug = $_GET['slug'] ?? '';
if (!$slug || !preg_match('/^[a-z0-9\-]+$/', $slug)) {
    echo json_encode(['status' => 'error', 'message' => 'Slug không hợp lệ']);
    exit;
}

try {
    $db = new Database();
    $result = $db->select(
        "SELECT tieu_de, mo_ta, icon FROM trang_tinh WHERE slug = ?",
        "s",
        [$slug]
    );
    $db->close();

    if (!empty($result)) {
        echo json_encode([
            'status' => 'success',
            'data' => [
                'title'    => $result[0]['tieu_de'],
                'subtitle' => $result[0]['mo_ta'],
                'icon'     => $result[0]['icon'],
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy trang']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Lỗi server']);
}
?>
