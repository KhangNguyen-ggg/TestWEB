<?php
header('Content-Type: application/json');
require_once '../db/database.php';

$slug = $_GET['slug'] ?? '';
$db = new Database();
$result = $db->select("SELECT tieu_de, mo_ta, icon FROM trang_tinh WHERE slug = '$slug'");
$db->close();

if (!empty($result)) {
    echo json_encode([
        'status' => 'success',
        'data' => [
            'title' => $result[0]['tieu_de'],
            'subtitle' => $result[0]['mo_ta'],
            'icon' => $result[0]['icon']
        ]
    ]);
} else {
    echo json_encode(['status' => 'error']);
}
?>