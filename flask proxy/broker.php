<?php
// Укажите путь к файлу
$file_path = "C:\\Users\\admin\\Desktop\\Work\\exchange\\geom.txt";

// Чтение содержимого файла
$file_content = file_get_contents($file_path);

if ($file_content === false) {
    // Если файл не удалось прочитать, возвращаем ошибку
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Не удалось прочитать файл."]);
    exit();
}

// Устанавливаем заголовки для ответа
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Возвращаем содержимое файла
echo $file_content;
?>