<?php
class Database
{
    private $host = "localhost";
    private $user = "root";
    private $pass = "";
    private $dbname = "website_vnpt";
    private $conn;

    public function __construct()
    {
        $this->conn = new mysqli($this->host, $this->user, $this->pass, $this->dbname);

        if ($this->conn->connect_error) {
            throw new Exception("Kết nối thất bại: " . $this->conn->connect_error);
        }

        $this->conn->set_charset("utf8mb4");
    }

    public function getConnection()
    {
        return $this->conn;
    }

    public function select($sql, $types = "", $params = [])
    {
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Lỗi prepare: " . $this->conn->error);
        }

        if ($types !== "" && !empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $stmt->close();
        return $data;
    }

    public function execute($sql, $types = "", $params = [])
    {
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Lỗi prepare: " . $this->conn->error);
        }

        if ($types !== "" && !empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        $success = $stmt->execute();
        if (!$success) {
            throw new Exception("Lỗi truy vấn: " . $stmt->error);
        }

        $stmt->close();
        return $success;
    }

    public function count($sql, $types = "", $params = [])
    {
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Lỗi prepare: " . $this->conn->error);
        }

        if ($types !== "" && !empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result ? $result->fetch_row() : [0];
        $stmt->close();
        return (int) ($row[0] ?? 0);
    }

    public function close()
    {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
?>