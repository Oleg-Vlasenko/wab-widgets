<?php

declare(strict_types=1);

// ------------------------------------------------------------
// Запрет кэширования
// ------------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');

// ------------------------------------------------------------
// Файл конфигурации
// ------------------------------------------------------------
$configFile = __DIR__ . '/widget_config.json';

if (!file_exists($configFile)) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error'   => 'Configuration file not found.'
    ]);

    exit;
}

// ------------------------------------------------------------
// Чтение конфигурации
// ------------------------------------------------------------
$config = file_get_contents($configFile);

if ($config === false) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error'   => 'Unable to read configuration.'
    ]);

    exit;
}

// ------------------------------------------------------------
// Проверка корректности JSON
// ------------------------------------------------------------
json_decode($config);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error'   => 'Invalid JSON: ' . json_last_error_msg()
    ]);

    exit;
}

// ------------------------------------------------------------
// Отдаем как есть
// ------------------------------------------------------------
echo $config;