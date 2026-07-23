<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../db/database.php';

$q = isset($_GET['q']) ? trim($_GET['q']) : '';

if (mb_strlen($q) < 2) {
    echo json_encode(['status' => 'success', 'data' => []]);
    exit;
}

try {
    $db = new Database();
    $keyword = '%' . $q . '%';
    
    // Gom kết quả từ 3 bảng: san_pham, bai_viet, trang_tinh bằng UNION ALL
    // Dùng chung cấu trúc cột: id (để làm link), title, description, type
    $sql = "
        (SELECT ma_san_pham AS id, ten_san_pham AS title, mo_ta_ngan AS description, 'san_pham' AS type 
         FROM san_pham 
         WHERE trang_thai = 'dang_ban' AND (ten_san_pham LIKE ? OR mo_ta_ngan LIKE ?)
         ORDER BY luot_ban DESC LIMIT 4)
         
        UNION ALL
        
        (SELECT slug AS id, tieu_de AS title, tom_tat AS description, 'bai_viet' AS type 
         FROM bai_viet 
         WHERE trang_thai = 'da_dang' AND (tieu_de LIKE ? OR tom_tat LIKE ?)
         LIMIT 3)
         
        UNION ALL
        
        (SELECT slug AS id, tieu_de AS title, mo_ta AS description, 'trang_tinh' AS type 
         FROM trang_tinh 
         WHERE tieu_de LIKE ? OR mo_ta LIKE ?
         LIMIT 2)
    ";

    // Truyền 6 lần biến $keyword vì có 6 dấu ? trong câu SQL
    $results = $db->select($sql, "ssssss", [$keyword, $keyword, $keyword, $keyword, $keyword, $keyword]);
    $db->close();

    echo json_encode(['status' => 'success', 'data' => $results]);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Lỗi server: ' . $e->getMessage()]);
}
?>