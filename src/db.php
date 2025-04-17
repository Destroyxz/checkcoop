<?php
$host = 'db5017684907.hosting-data.io';
$dbname = 'dbs14141935';
$username = 'dbu319932';
$password = 'penedestroyxz';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
